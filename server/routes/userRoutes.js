import express from 'express';
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js';
import upload from '../config/multer.js';
import { clerkMiddleware } from '@clerk/express';  // Clerk middleware

const router = express.Router();

// Ensure Clerk middleware is applied on each route to check for authentication
router.use(clerkMiddleware());  // Protect routes requiring Clerk authentication

// Get user data 
router.get('/user', getUserData);

// Apply for a job
router.post('/apply', applyForJob);

// Get applied jobs data
router.get('/applications', getUserJobApplications);

// Update User profile (resume)
router.post('/update-resume', upload.single('resume'), updateUserResume);

export default router;
