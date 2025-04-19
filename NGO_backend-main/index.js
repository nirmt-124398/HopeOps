import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  apiLimiter,
  securityHeaders,
  sanitizeInput,
} from './middleware/security.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/auth.router.js';
import authorizationRouter from './routes/test.router.js'
import userDetails from './routes/user.router.js';
import ngoRouter from './routes/ngo.router.js';
import emergencyRouter from './routes/emergency.router.js';
import subscriptionRouter from './routes/subscription.routes.js';
import adoptionRouter from './routes/adoption.router.js';
import animalRouter from './routes/animal.router.js';
import userRoutes from './routes/user.routes.js';
// import donationRouter from './routes/donation.router.js';

dotenv.config();

const app = express();


// Apply security headers (Helmet)
app.use(securityHeaders);

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Frontend URL
    credentials: true, // Allow cookies/auth headers
  })
);

// Handle preflight requests globally
app.options('*', cors());

// Rate limiting (200 requests per 15 minutes)
// app.use(apiLimiter);

// Sanitize input to prevent XSS attacks
app.use(sanitizeInput);

app.use(express.json());
app.use(cookieParser());

// Routes 

app.use('/api/auth', authRouter);
app.use('/api/test', authorizationRouter);
app.use('/api/user', userDetails);
app.use('/api/ngos', ngoRouter);
app.use('/api/emergencies', emergencyRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/users', userRoutes);
app.use('/api/adoptions', adoptionRouter);
app.use('/api/animals', animalRouter);
// app.use('/api/donations', donationRouter);


app.use(errorHandler); 


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});