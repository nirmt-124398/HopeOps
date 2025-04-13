// // routes/adoption.js
// import express from 'express';
// import { 
//   listAnimals,
//   requestAdoption,
//   getAdoptionStatus,
//   manageAdoption
// } from '../controllers/adoption.js';
// import { verifyToken, requireRole } from '../middleware/auth.js';

// const router = express.Router();

// // Public routes
// router.get('/animals', listAnimals);

// // User routes
// router.post('/request', verifyToken, requestAdoption);
// router.get('/request/:id', verifyToken, getAdoptionStatus);

// // NGO Admin routes
// router.put('/request/:id', verifyToken, requireRole('NGO_ADMIN'), manageAdoption);

// export default router;