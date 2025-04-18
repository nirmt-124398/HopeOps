import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { listAllNGOs, createNGO, updateNGO, getNGODashboard } from '../controllers/ngo.controller.js';
import { createNGOSchema } from '../middleware/validators.js';
import { validateRequest } from '../middleware/validation.js';

const router = express.Router();

// Get all NGOs
router.get('/', verifyToken, listAllNGOs);

// Create NGO - with validation middleware
router.post('/', verifyToken, validateRequest(createNGOSchema), createNGO);

// Get NGO dashboard
router.get('/:id/dashboard', verifyToken, getNGODashboard);

// Update NGO
router.put('/:id', verifyToken, updateNGO);

export default router;
