import express from 'express';
import { 
  ShouldBeLoggedIn, 
  ShouldBeUser, 
  ShouldBeNGOAdmin, 
  ShouldBeSuperAdmin, 
  ShouldBeAdminOrSuperAdmin 
} from '../controllers/test.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Public route - no authentication needed
router.get('/public', (req, res) => {
  res.json({ message: 'This is a public route - no authentication required' });
});

// Authentication test route - any logged in user
router.get('/should-be-logged-in', verifyToken, ShouldBeLoggedIn);

// Role-based routes 
router.get('/should-be-user', verifyToken, requireRole('USER'), ShouldBeUser);
router.get('/should-be-ngo-admin', verifyToken, requireRole('NGO_ADMIN'), ShouldBeNGOAdmin);
router.get('/should-be-super-admin', verifyToken, requireRole('SUPER_ADMIN'), ShouldBeSuperAdmin);

// Multiple roles allowed route
router.get('/should-be-any-admin', verifyToken, requireRole('NGO_ADMIN', 'SUPER_ADMIN'), ShouldBeAdminOrSuperAdmin);



export default router;