import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// Validate Razorpay credentials
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are missing. Please check your .env file.');
}

// Initialize Razorpay with credentials from environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
export const getSubscriptiondetailById = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        if (!subscriptionId) {
            return res.status(400).json({
                success: false,
                message: 'Subscription ID is required'
            });
        }

        const SubscriptionDetails = await razorpay.subscriptions.fetch(subscriptionId);

        if (SubscriptionDetails) {
            return res.status(200).json({
                success: true,
                subscription: SubscriptionDetails
            });
        }
    } catch (error) {
        console.error('Error fetching subscription details:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch subscription details',
        });
    }
};

export const createSubscription = async (req, res) => {
    try {
        const { plan_id, ngoDetails } = req.body;

        if (!plan_id) {
            return res.status(400).json({ 
                success: false, 
                error: 'Plan ID is required' 
            });
        }

        // Create subscription with minimal notes
        const subscription = await razorpay.subscriptions.create({
            plan_id: plan_id,
            total_count: 12, // 1 year subscription
            notes: {
                ngo_name: ngoDetails.name,
                contact_email: ngoDetails.contactEmail
            }
        });

        res.json({ 
            success: true, 
            subscription 
        });
    } catch (error) {
        console.error('Subscription creation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message || 'Failed to create subscription' 
        });
    }
};

export const verifySubscription = async (req, res) => {
    try {
        const { subscription_id, razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

        console.log('Received verification details:', {
            subscription_id,
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });

        if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
            console.log('Missing verification details');
            return res.status(400).json({
                success: false,
                message: 'Missing required payment verification details'
            });
        }

        try {
            // For subscriptions, the signature is generated using razorpay_payment_id|razorpay_subscription_id
            const body = razorpay_payment_id + "|" + razorpay_subscription_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest("hex");

            console.log('Signature verification:', {
                body,
                expectedSignature,
                receivedSignature: razorpay_signature
            });

            if (expectedSignature !== razorpay_signature) {
                console.log('Signature mismatch:', { 
                    expected: expectedSignature, 
                    received: razorpay_signature 
                });
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment signature'
                });
            }

            // Then fetch the subscription details
            const subscription = await razorpay.subscriptions.fetch(razorpay_subscription_id);
            console.log('Subscription details:', subscription);

            // For subscriptions, we consider these statuses as successful
            const validStatuses = ['active', 'authenticated', 'created'];
            if (validStatuses.includes(subscription.status)) {
                // Just store the subscription ID for now, we'll create proper relation later
                // We don't need to create a database entry yet, just return the Razorpay data
                return res.status(200).json({
                    success: true,
                    subscription: {
                        id: subscription.id,
                        planId: subscription.plan_id,
                        status: subscription.status,
                        payment_id: razorpay_payment_id
                    },
                    message: 'Subscription is valid'
                });
            } else {
                console.log('Invalid subscription status:', subscription.status);
                return res.status(400).json({
                    success: false,
                    message: `Subscription is not valid (status: ${subscription.status})`
                });
            }
        } catch (error) {
            console.error('Razorpay API error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to verify with Razorpay',
                error: error.message
            });
        }
    } catch (error) {
        console.error('Subscription verification error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const fetchPlans = async (req, res) => {
    try {
        // Plan IDs for the three subscription plans
        const planIds = [
            'plan_QKaRHXw97jqx3D', // Basic Plan
            'plan_QKaQFijHbusHo5', // Standard Plan
            'plan_QKaOq9TcEmn0r8'  // Premium Plan
        ];

        // Fetch plans from Razorpay
        const plans = await Promise.all(
            planIds.map(async (planId) => {
                const plan = await razorpay.plans.fetch(planId);
                return {
                    id: plan.id,
                    name: plan.item.name,
                    description: plan.item.description,
                    amount: plan.item.amount,
                    currency: plan.item.currency,
                    interval: plan.interval,
                    period: plan.period,
                    active: plan.item.active,
                };
            })
        );

        res.status(200).json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subscription plans",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};