// routes/emergency.js

import express from 'express';
import { 
  listEmergencies, 
  createEmergency, 
  getEmergencyStatus, 
  respondToEmergency,
  updateEmergencyResponseStatus 
} from '../controllers/emergency.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public route: list emergencies
router.get('/', listEmergencies);

// User route: create emergency and check status (requires authentication)
router.post('/', verifyToken, createEmergency);
router.get('/:EmergencyId', verifyToken, getEmergencyStatus);

// NGO Admin route: respond to emergency (requires NGO_ADMIN role)
router.post('/:EmergencyId/respond', verifyToken, requireRole('NGO_ADMIN'), respondToEmergency);

// New route: Update emergency response status (requires NGO_ADMIN role)
router.patch('/:emergencyId/response/:responseId', verifyToken, requireRole('NGO_ADMIN'), updateEmergencyResponseStatus);

export default router;
