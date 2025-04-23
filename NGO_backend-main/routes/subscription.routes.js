import express from 'express';
import { createSubscription, verifySubscription, fetchPlans,getSubscriptiondetailById } from '../controllers/subscription.controller.js';
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

// Error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Fetch plans with PlanId
router.get('/plans', verifyToken, asyncHandler(fetchPlans)); 

// Create subscription
router.post('/create', verifyToken, asyncHandler(createSubscription));

// Verify subscription - Don't use verifyToken middleware here to allow callbacks
router.post('/verify', asyncHandler(verifySubscription));

router.get('/getSubscriptiondetailById/:subscriptionId', verifyToken, getSubscriptiondetailById);
export default router;