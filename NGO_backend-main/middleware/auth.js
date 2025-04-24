// middleware/auth.js
import jwt from 'jsonwebtoken';
import prisma from '../lib/prismaclient.js';

export const verifyToken = async (req, res, next) => {
  try {
    // Debug the incoming request headers and cookies
    console.log('Auth headers:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('Cookies present:', req.cookies ? 'Yes' : 'No');
    console.log('Token cookie:', req.cookies?.token ? 'Found' : 'Not found');
    
    // Get token from either cookie or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token found in request');
      return res.status(401).json({ message: 'Unauthorized: Not Logged-In' });
    }

    console.log('Token found, attempting to verify');
    
    // Verify the token with JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully, user ID:', decoded.id);
        
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.id,
      },
      select: { id: true, role: true, deletedAt: true }
    });

    if (!user) {
      console.log('User not found in database:', decoded.id);
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    console.log('User authenticated successfully, role:', user.role);
    
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