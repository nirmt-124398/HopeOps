// import express from 'express';
// import {
//   createSubscription,
//   verifySubscriptionPayment,
//   cancelSubscription,
//   getNGOSubscription,
//   getSubscriptionPlans,
//   handleSubscriptionWebhook
// } from '../controllers/subscription.controller.js';
// import { verifyToken, requireRole } from '../middleware/auth.js';
// import { validateRequest } from '../middleware/validators.js';
// import Joi from 'joi';

// const router = express.Router();

// // Validation schemas
// const createSubscriptionSchema = Joi.object({
//   ngoId: Joi.string().required().messages({
//     'string.empty': 'NGO ID is required'
//   }),
//   planId: Joi.string().required().messages({
//     'string.empty': 'Plan ID is required'
//   })
// });

// const verifyPaymentSchema = Joi.object({
//   subscriptionId: Joi.string().required(),
//   razorpay_order_id: Joi.string().required(),
//   razorpay_payment_id: Joi.string().required(),
//   razorpay_signature: Joi.string().required()
// });

// const cancelSubscriptionSchema = Joi.object({
//   reason: Joi.string().allow('', null)
// });

// // Public routes
// router.get('/plans', getSubscriptionPlans);

// // Protected routes - NGO Admin and Super Admin access
// router.post('/create',verifyToken,requireRole('NGO_ADMIN', 'SUPER_ADMIN'),validateRequest(createSubscriptionSchema),createSubscription
// );

// router.post('/verify',verifyToken,requireRole('NGO_ADMIN', 'SUPER_ADMIN'),validateRequest(verifyPaymentSchema),verifySubscriptionPayment
// );

// router.post('/cancel/:id',verifyToken,requireRole('NGO_ADMIN', 'SUPER_ADMIN'),validateRequest(cancelSubscriptionSchema),cancelSubscription
// );

// router.get('/ngo/:ngoId',verifyToken,requireRole('NGO_ADMIN', 'SUPER_ADMIN'),getNGOSubscription
// );

// // Webhook handler - public route secured by signature verification
// router.post('/webhook', handleSubscriptionWebhook);

// export default router;