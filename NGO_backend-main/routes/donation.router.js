// routes/donation.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { 
  createOrder,
  verifyPayment,
  getAllDonations,
  getUserDonations,
  cleanupStaleDonations,
  retryPayment
} from '../controllers/donation.controller.js';

const router = express.Router();

// Apply token verification but make it optional for guest donations
const optionalAuth = (req, res, next) => {
  // Try to verify the token, but continue even if no token is present
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
    }
  } catch (error) {
    // Optional auth - continue without setting user
  }
  next();
};

// Routes with optional authentication - allow guest donations but capture user ID if logged in
router.post('/order', optionalAuth, createOrder);

// Public route for payment verification
router.post('/verify', verifyPayment);

// Add these new routes for managing pending donations
router.post('/cleanup', verifyToken, requireRole('NGO_ADMIN'), cleanupStaleDonations);
router.post('/retry/:donationId', optionalAuth, retryPayment);

// Protected routes
router.get('/admin', verifyToken, requireRole('NGO_ADMIN'), getAllDonations); 
router.get('/user', verifyToken, getUserDonations); // User: Get own donations

export default router;