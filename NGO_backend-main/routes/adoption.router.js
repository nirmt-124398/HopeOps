// routes/adoption.js
import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { 
  createAdoptionRequest, 
  getNGOAdoptionRequests, 
  getUserAdoptionRequests, 
  updateAdoptionRequestStatus 
} from '../controllers/adoption.controller.js';

const router = express.Router();

// User routes
router.post('/request', verifyToken, createAdoptionRequest);
router.get('/user-requests', verifyToken, getUserAdoptionRequests);

// NGO Admin routes
router.get('/ngo-requests', verifyToken, requireRole('NGO_ADMIN'), getNGOAdoptionRequests);
router.put('/request/:id', verifyToken, requireRole('NGO_ADMIN'), updateAdoptionRequestStatus);

export default router;