// routes/ngo.js
import express from 'express';
import {
  createNGO,
  updateNGO,
  getNGODashboard,
  listAllNGOs,
  getData
} from '../controllers/ngo.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { createNGOSchema, validateRequest } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.get('/', listAllNGOs);

// Protected routes
router.post('/', verifyToken, validateRequest(createNGOSchema), createNGO);
router.put('/:id', verifyToken, requireRole('NGO_ADMIN'), updateNGO);
router.get('/dashboard/:id', verifyToken, requireRole('NGO_ADMIN'), getNGODashboard);
router.get('/dashboard', verifyToken, requireRole('NGO_ADMIN'), getData);

export default router;