// routes/auth.js
import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { loginSchema, registerSchema, validateRequest } from '../middleware/validators.js';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);


// Protected routes
router.post('/logout', verifyToken, logout);

export default router;