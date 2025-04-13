// middleware/auth.js
import jwt from 'jsonwebtoken';
import prisma from '../lib/prismaclient.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Not Logged-In' });
    }

    // Add debugging to see the token


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add debugging to see the decoded token

        
    // Verify user exists in database using findFirst instead of findUnique
    // This gives us more flexibility in filtering
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.id,
      },
      select: { id: true, role: true,deletedAt: true } // Giving deletedAt to check if user is deleted is necessary if you want to check if user is deleted or not
    });


    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    // Set user ID and role on the request object
    req.user = user.id;
    req.userRole = user.role;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ message: 'No role assigned' });
    }
    
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    
    next();
  };
};