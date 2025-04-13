// import prisma from "../lib/prismaclient.js";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import dotenv from "dotenv";

// dotenv.config();

// // Initialize Razorpay client with credentials from environment variables
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// /**
//  * Create a new subscription for an NGO
//  * @route POST /api/subscription/create
//  * @access Private (NGO_ADMIN, SUPER_ADMIN)
//  */
// export const createSubscription = async (req, res) => {
//     try {
//         const { ngoId, planId } = req.body;
//         const userId = req.user;


//         // Input validation
//         if (!ngoId || !planId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "NGO ID and Plan ID are required"
//             });
//         }

//         // Validate the NGO exists
//         const ngo = await prisma.NGO.findUnique({
//             where: {
//                 id: ngoId,
//             }
//         });

//         if (!ngo) {
//             return res.status(404).json({
//                 success: false,
//                 message: "NGO not found or has been deleted"
//             });
//         }
//         // Add this to a route handler temporarily to check

//         // Validate the user has permission to create a subscription for this NGO
//         if (req.userRole !== 'SUPER_ADMIN') { // Only SUPER_ADMIN can create subscriptions for any NGO or ngo manager can create for their own NGO.
//             const isNGOAdmin = await prisma.NGOAdmin.findFirst({
//                 where: {
//                     ngoId: ngoId,
//                     userId: userId
//                 }
//             });
//             console.log("NGO Admin relationship:", isNGOAdmin);
//             if (!isNGOAdmin) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "You don't have permission to create a subscription for this NGO"
//                 });
//             }
//         }

//         // Get the subscription plan
//         const plan = await prisma.SubscriptionPlan.findUnique({
//             where: {
//                 id: planId
//             }
//         });

//         if (!plan) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Subscription plan not found"
//             });
//         }

//         // Check if there's already an active subscription
//         const activeSubscription = await prisma.Subscription.findFirst({
//             where: {
//                 ngoId: ngoId,
//                 status: 'COMPLETED'
//             },
//             include: {
//                 plan: true
//             }
//         });

//         if (activeSubscription) {
//             const today = new Date();
//             if (new Date(activeSubscription.endDate) > today) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "NGO already has an active subscription",
//                     currentSubscription: {
//                         id: activeSubscription.id,
//                         planName: activeSubscription.plan.name,
//                         endDate: activeSubscription.endDate
//                     }
//                 });
//             }
//         }

//         // Create a unique receipt ID
//         const receiptId = `sub_${ngoId.substring(0, 8)}_${Date.now()}`;

//         // Create a Razorpay order
//         let razorpayOrder;
//         try {
//             razorpayOrder = await razorpay.orders.create({
//                 amount: Math.round(plan.price * 100), // Razorpay expects amount in smallest currency unit (paise)
//                 currency: "INR",
//                 receipt: receiptId,
//                 notes: {
//                     ngoId: ngoId,
//                     planId: planId,
//                     userId: userId,
//                     planName: plan.name
//                 }
//             });
//         } catch (razorpayError) {
//             console.error("Razorpay order creation failed:", razorpayError);
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to create payment order with Razorpay"
//             });
//         }

//         // Calculate start and end dates based on plan duration (in months)
//         const startDate = new Date();
//         const endDate = new Date();
//         endDate.setMonth(endDate.getMonth() + plan.duration);

//         // Create the subscription in the database
//         const newSubscription = await prisma.Subscription.create({
//             data: {
//                 ngo: { connect: { id: ngoId } },
//                 plan: { connect: { id: planId } },
//                 startDate,
//                 endDate,
//                 status: 'PENDING',
//                 razorpayOrderId: razorpayOrder.id
//             }
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Subscription order created successfully",
//             data: {
//                 subscriptionId: newSubscription.id,
//                 orderId: razorpayOrder.id,
//                 amount: plan.price,
//                 currency: "INR",
//                 key: process.env.RAZORPAY_KEY_ID,
//                 razorpayOrderId: razorpayOrder.id,
//                 prefill: {
//                     name: ngo.name,
//                     email: ngo.contactEmail,
//                     contact: ngo.phone || ""
//                 }
//             }
//         });
//     } catch (error) {
//         console.error("Error creating subscription:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error creating subscription",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// /**
//  * Verify a subscription payment
//  * @route POST /api/subscription/verify
//  * @access Private (NGO_ADMIN, SUPER_ADMIN)
//  */
// export const verifySubscriptionPayment = async (req, res) => {
//     try {
//         const { subscriptionId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         // Input validation
//         if (!subscriptionId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required payment verification parameters"
//             });
//         }

//         // Fetch the subscription
//         const subscription = await prisma.Subscription.findUnique({
//             where: { id: subscriptionId }
//         });

//         if (!subscription) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Subscription not found"
//             });
//         }

//         if (subscription.status !== 'PENDING') {
//             return res.status(400).json({
//                 success: false,
//                 message: "Subscription is not in pending state"
//             });
//         }

//         if (subscription.razorpayOrderId !== razorpay_order_id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Order ID mismatch"
//             });
//         }

//         // Verify the payment signature
//         const signatureData = `${razorpay_order_id}|${razorpay_payment_id}`;
//         const generatedSignature = crypto
//             .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
//             .update(signatureData)
//             .digest('hex');

//         if (generatedSignature !== razorpay_signature) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Payment verification failed: Invalid signature"
//             });
//         }

//         // Payment signature is valid, update the subscription
//         const updatedSubscription = await prisma.Subscription.update({
//             where: { id: subscriptionId },
//             data: {
//                 status: 'COMPLETED'
//             }
//         });

//         // Create a webhook event record
//         await prisma.WebhookEvent.create({
//             data: {
//                 type: 'subscription.payment.verified',
//                 payload: {
//                     subscriptionId,
//                     paymentId: razorpay_payment_id,
//                     orderId: razorpay_order_id
//                 }
//             }
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Subscription payment verified successfully",
//             data: updatedSubscription
//         });
//     } catch (error) {
//         console.error("Error verifying subscription payment:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error verifying subscription payment",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// /**
//  * Cancel a subscription
//  * @route POST /api/subscription/cancel/:id
//  * @access Private (NGO_ADMIN, SUPER_ADMIN)
//  */
// export const cancelSubscription = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { reason = "User requested cancellation" } = req.body;
//         const userId = req.user;

//         if (!id) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Subscription ID is required"
//             });
//         }

//         // Fetch the subscription
//         const subscription = await prisma.Subscription.findUnique({
//             where: { id },
//             include: {
//                 ngo: true
//             }
//         });

//         if (!subscription) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Subscription not found"
//             });
//         }

//         // Check if the user has permission to cancel this subscription
//         if (req.userRole !== 'SUPER_ADMIN') {
//             const isNGOAdmin = await prisma.NGOAdmin.findFirst({
//                 where: {
//                     ngoId: subscription.ngoId,
//                     userId: userId
//                 }
//             });

//             if (!isNGOAdmin) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "You don't have permission to cancel this subscription"
//                 });
//             }
//         }

//         // Only active or pending subscriptions can be cancelled
//         if (subscription.status !== 'COMPLETED' && subscription.status !== 'PENDING') {
//             return res.status(400).json({
//                 success: false,
//                 message: `Cannot cancel subscription with status: ${subscription.status}`
//             });
//         }

//         // Update the subscription status
//         const cancelledSubscription = await prisma.Subscription.update({
//             where: { id },
//             data: {
//                 status: 'FAILED' // Using FAILED since there's no CANCELLED in PaymentStatus enum
//             }
//         });

//         // Log the cancellation
//         await prisma.WebhookEvent.create({
//             data: {
//                 type: 'subscription.cancelled',
//                 payload: {
//                     subscriptionId: id,
//                     reason: reason,
//                     cancelledBy: userId
//                 }
//             }
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Subscription cancelled successfully",
//             data: cancelledSubscription
//         });
//     } catch (error) {
//         console.error("Error cancelling subscription:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error cancelling subscription",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// /**
//  * Get subscription details for an NGO
//  * @route GET /api/subscription/ngo/:ngoId
//  * @access Private (NGO_ADMIN, SUPER_ADMIN)
//  */
// export const getNGOSubscription = async (req, res) => {
//     try {
//         const { ngoId } = req.params;
//         const userId = req.user;

//         if (!ngoId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "NGO ID is required"
//             });
//         }

//         // Check if the NGO exists
//         const ngo = await prisma.NGO.findUnique({
//             where: { id: ngoId }
//         });

//         if (!ngo) {
//             return res.status(404).json({
//                 success: false,
//                 message: "NGO not found"
//             });
//         }

//         // Check if the user is authorized to access this NGO's subscription
//         if (req.userRole !== 'SUPER_ADMIN') {
//             const isNGOAdmin = await prisma.NGOAdmin.findFirst({
//                 where: {
//                     ngoId: ngoId,
//                     userId: userId
//                 }
//             });

//             if (!isNGOAdmin) {
//                 return res.status(403).json({
//                     success: false,
//                     message: "You don't have permission to access this NGO's subscription"
//                 });
//             }
//         }

//         // Get the active subscription for this NGO
//         const subscription = await prisma.Subscription.findFirst({
//             where: {
//                 ngoId: ngoId,
//                 status: 'COMPLETED'
//             },
//             include: {
//                 plan: true
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });

//         if (!subscription) {
//             // Check if there's a pending subscription
//             const pendingSubscription = await prisma.Subscription.findFirst({
//                 where: {
//                     ngoId: ngoId,
//                     status: 'PENDING'
//                 },
//                 include: {
//                     plan: true
//                 },
//                 orderBy: {
//                     createdAt: 'desc'
//                 }
//             });

//             if (pendingSubscription) {
//                 return res.status(200).json({
//                     success: true,
//                     data: pendingSubscription,
//                     message: "NGO has a pending subscription that requires payment"
//                 });
//             }

//             return res.status(404).json({
//                 success: false,
//                 message: "No active or pending subscription found for this NGO"
//             });
//         }

//         // Calculate remaining days
//         const currentDate = new Date();
//         const endDate = new Date(subscription.endDate);
//         const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

//         return res.status(200).json({
//             success: true,
//             data: {
//                 ...subscription,
//                 remainingDays: remainingDays > 0 ? remainingDays : 0
//             }
//         });
//     } catch (error) {
//         console.error("Error fetching NGO subscription:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching NGO subscription",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// /**
//  * Get all available subscription plans
//  * @route GET /api/subscription/plans
//  * @access Public
//  */
// export const getSubscriptionPlans = async (req, res) => {
//     try {
//         // Retrieve all subscription plans
//         const plans = await prisma.SubscriptionPlan.findMany({
//             orderBy: {
//                 price: 'asc'
//             },
//             select: {
//                 id: true,
//                 name: true,
//                 price: true,
//                 duration: true,
//                 features: true
//             }
//         });

//         if (!plans || plans.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No subscription plans found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             data: plans
//         });
//     } catch (error) {
//         console.error("Error fetching subscription plans:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Error fetching subscription plans",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };

// /**
//  * Handle Razorpay webhook for subscription events
//  * @route POST /api/subscription/webhook
//  * @access Public (secured by signature verification)
//  */
// export const handleSubscriptionWebhook = async (req, res) => {
//     try {
//         // Verify webhook signature
//         const webhookSignature = req.headers['x-razorpay-signature'];

//         if (!webhookSignature) {
//             console.error("Missing Razorpay webhook signature");
//             // Return 200 to prevent Razorpay from retrying
//             return res.status(200).json({
//                 success: false,
//                 message: "Missing webhook signature"
//             });
//         }

//         try {
//             // Verify the webhook signature
//             const expectedSignature = crypto
//                 .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
//                 .update(JSON.stringify(req.body))
//                 .digest('hex');

//             if (expectedSignature !== webhookSignature) {
//                 console.error("Invalid Razorpay webhook signature");
//                 // Return 200 to prevent Razorpay from retrying
//                 return res.status(200).json({
//                     success: false,
//                     message: "Invalid webhook signature"
//                 });
//             }
//         } catch (signatureError) {
//             console.error("Error verifying webhook signature:", signatureError);
//             // Return 200 to prevent Razorpay from retrying
//             return res.status(200).json({
//                 success: false,
//                 message: "Error verifying webhook signature"
//             });
//         }

//         // Process webhook event
//         const event = req.body;

//         // Log webhook event to database
//         await prisma.WebhookEvent.create({
//             data: {
//                 type: event.event,
//                 payload: event
//             }
//         });

//         // Always return 200 for webhooks
//         return res.status(200).json({
//             success: true,
//             message: "Webhook received and processed"
//         });
//     } catch (error) {
//         console.error("Error processing webhook:", error);
//         // Always return 200 for webhooks to prevent Razorpay from retrying
//         return res.status(200).json({
//             success: false,
//             message: "Error processing webhook",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// };