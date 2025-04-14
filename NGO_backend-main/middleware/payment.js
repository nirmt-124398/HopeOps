// middleware/payment.js
import crypto from 'crypto';

export const verifyWebhook = (req, res, next) => {
  const razorpaySignature = req.headers['x-razorpay-signature'];
  
  if (!razorpaySignature) {
    return res.status(401).json({ message: 'Missing signature header' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    return res.status(401).json({ message: 'Invalid webhook signature' });
  }

  next();
};