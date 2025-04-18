import express from 'express';
import { getUserProfile, updateUserProfile, deleteUserProfile, updateUserRole } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.delete('/profile', verifyToken, deleteUserProfile);
router.put('/role', verifyToken, updateUserRole);

export default router;
