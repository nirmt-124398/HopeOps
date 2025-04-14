//user.router.js 
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/profile',verifyToken,getUserProfile);
router.put('/profile',verifyToken,updateUserProfile); 
router.delete('/profile',verifyToken,deleteUserProfile);

export default router;