// routes/ngo.js
import express from 'express';
import { 
  createNGO, 
  updateNGO,
  getNGODashboard,
  listAllNGOs
} from '../controllers/ngo.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { createNGOSchema, updateNGOSchema, validateRequest } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.get('/', listAllNGOs);

// NGO Admin routes
router.post('/', verifyToken, requireRole('NGO_ADMIN'), validateRequest(createNGOSchema), createNGO);
router.put('/:id', verifyToken, requireRole('NGO_ADMIN'), validateRequest(updateNGOSchema), updateNGO);
router.get('/dashboard/:id', verifyToken, requireRole('NGO_ADMIN'), getNGODashboard);

export default router;