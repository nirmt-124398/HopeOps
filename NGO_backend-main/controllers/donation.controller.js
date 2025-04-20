import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

dotenv.config();

const prisma = new PrismaClient();

// Initialize Razorpay with credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
export const createOrder = async (req, res) => {
  try {
    // Extract user ID from token if available
    let userId = null;
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (error) {
        // Failed to decode token - continue as guest
      }
    }

    const schema = z.object({
      donationAmount: z.number().int().positive("Amount must be a positive integer"),
      donorName: z.string().optional(),
      email: z.string().email("Invalid email format").optional(),
      purpose: z.string().optional(),
      comment: z.string().optional(),
    });

    // Validate request body
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const { donationAmount, donorName, email, purpose, comment } = validation.data;

    // Generate a unique receipt ID
    const receipt = `donation_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create order in Razorpay - amount in paise (₹500 = 50000 paise)
    const order = await razorpay.orders.create({
      amount: donationAmount * 100, // Convert to paise
      currency: 'INR',
      receipt,
      notes: {
        donor_name: donorName || 'Anonymous',
        email: email || 'Not provided',
        purpose: purpose || 'General',
        comment: comment || ''
      },
      payment_capture: 1, // Auto-capture payment when successful
    });

    // Store order in database with temporary paymentId value and user ID if available
    const donation = await prisma.donation.create({
      data: {
        orderId: order.id,
        amount: donationAmount,
        currency: 'INR',
        donorName: donorName || 'Anonymous',
        email: email || null,
        purpose: purpose || 'General',
        comment: comment || null,
        status: 'PENDING',
        receipt: receipt,
        paymentId: 'pending',
        userId: userId, // This will be null for guest donations
      }
    });

    return res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Error creating donation order:", error);
    return res.status(500).json({ error: "Failed to create donation order" });
  }
};

// Verify Razorpay payment signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Update donation status in database
    const updatedDonation = await prisma.donation.updateMany({
      where: { 
        orderId: razorpay_order_id,
        status: 'PENDING'
      },
      data: { 
        status: 'COMPLETED',
        paymentId: razorpay_payment_id,
        paidAt: new Date()
      }
    });

    if (updatedDonation.count === 0) {
      return res.status(404).json({ error: "Donation not found or already processed" });
    }

    // Fetch the complete donation record
    const donation = await prisma.donation.findFirst({
      where: { orderId: razorpay_order_id }
    });

    return res.status(200).json({
      success: true,
      donation
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
};

// Get all donations (for admin)
export const getAllDonations = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.userRole || (req.userRole !== 'ADMIN' && req.userRole !== 'NGO_ADMIN')) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get all donations
    const donations = await prisma.donation.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    return res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching donations:", error);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// Get user donations
export const getUserDonations = async (req, res) => {
  try {
    // Extract user ID correctly
    let userId = null;
    if (req.user) {
      userId = typeof req.user === 'object' ? req.user.id : req.user;
    }
    
    // Try to find donations by both userId formats
    const donations = await prisma.donation.findMany({
      where: {
        OR: [
          { userId: userId }, 
          { userId: req.user }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json(donations);
  } catch (error) {
    console.error("Error fetching user donations:", error);
    return res.status(500).json({ error: "Failed to fetch donations" });
  }
};

// Clean up stale pending donations
export const cleanupStaleDonations = async (req, res) => {
  try {
    // Find pending donations older than 24 hours
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    
    const staleDonations = await prisma.donation.updateMany({
      where: { 
        status: 'PENDING',
        createdAt: {
          lt: cutoffTime
        }
      },
      data: { 
        status: 'EXPIRED'
      }
    });
    
    return res.status(200).json({
      success: true,
      expiredCount: staleDonations.count
    });
  } catch (error) {
    console.error("Error cleaning up stale donations:", error);
    return res.status(500).json({ error: "Failed to clean up stale donations" });
  }
};

// Retry a payment
export const retryPayment = async (req, res) => {
  try {
    const { donationId } = req.params;
    
    // Find the donation
    const donation = await prisma.donation.findUnique({
      where: { id: donationId }
    });
    
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }
    
    if (donation.status !== 'PENDING') {
      return res.status(400).json({ error: "Only pending donations can be retried" });
    }
    
    // Create a new Razorpay order
    const order = await razorpay.orders.create({
      amount: donation.amount * 100,
      currency: donation.currency,
      receipt: donation.receipt,
      notes: {
        donor_name: donation.donorName,
        email: donation.email || 'Not provided',
        purpose: donation.purpose,
        comment: donation.comment || ''
      },
      payment_capture: 1
    });
    
    // Update the donation with the new order ID
    await prisma.donation.update({
      where: { id: donationId },
      data: { 
        orderId: order.id,
        updatedAt: new Date()
      }
    });
    
    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Error retrying payment:", error);
    return res.status(500).json({ error: "Failed to create new payment order" });
  }
};
