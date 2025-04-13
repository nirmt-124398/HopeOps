// // routes/donation.js
// import express from 'express';
// import { 
//   createDonation,
//   verifyPayment,
//   listDonations,
//   getDonationReceipt
// } from '../controllers/donation.js';
// import { verifyToken } from '../middleware/auth.js';

// const router = express.Router();

// // Public routes (for payment webhooks)
// router.post('/webhook', verifyPayment);

// // Protected routes
// router.post('/', verifyToken, createDonation);
// router.get('/', verifyToken, listDonations);
// router.get('/:id/receipt', verifyToken, getDonationReceipt);

// export default router;