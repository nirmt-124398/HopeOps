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

// Add this route to your test routes
router.post('/create-ngo-admin', verifyToken, requireRole('SUPER_ADMIN'), async (req, res) => {
  try {
    const { userId, ngoData } = req.body;
    
    // 1. Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // 2. Update user role to NGO_ADMIN if not already
    if (user.role !== 'NGO_ADMIN') {
      await prisma.user.update({
        where: { id: userId },
        data: { role: 'NGO_ADMIN' }
      });
    }
    
    // 3. Create the NGO
    const ngo = await prisma.NGO.create({
      data: {
        ...ngoData,
        // Create NGO admin record
        admins: {
          create: [{
            user: { connect: { id: userId } }
          }]
        }
      },
      include: {
        admins: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });
    
    res.status(201).json({
      message: "NGO and admin created successfully",
      ngo
    });
  } catch (error) {
    console.error("Error in test create-ngo-admin:", error);
    res.status(500).json({ message: "Error creating NGO and admin", error: error.message });
  }
});

export default router;