import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { 
  createAnimal, 
  getAllAnimals, 
  getAnimalById, 
  updateAnimal, 
  deleteAnimal,
  getNGOAnimals
} from '../controllers/animal.controller.js';

const router = express.Router();

// Public routes
router.get('/', getAllAnimals);
router.get('/:id', getAnimalById);

// Protected routes - NGO Admin only
router.get('/ngo/animals', verifyToken, requireRole('NGO_ADMIN'), getNGOAnimals);
router.post('/', verifyToken, requireRole('NGO_ADMIN'), createAnimal);
router.put('/:id', verifyToken, requireRole('NGO_ADMIN'), updateAnimal);
router.delete('/:id', verifyToken, requireRole('NGO_ADMIN'), deleteAnimal);

export default router;
