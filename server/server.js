import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import testWebhook from "./controllers/testWebhook.js";
import * as Sentry from "@sentry/node";
import dotenv from 'dotenv';
import { clerkWebhooks } from './controllers/webhooks.js';
import mongoose from 'mongoose';
import User from './models/User.js';


import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import{clerkMiddleware} from '@clerk/express'



dotenv.config();

const app = express();

// Connect to database
await connectDB();
await connectCloudinary()


// Middlewares
app.use(clerkMiddleware())




// Middleware to store raw body for webhook verification
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));
app.use(cors());

// Routes
app.use('/test-webhook', testWebhook);
app.post('/webhooks', clerkWebhooks);
app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});
app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRoutes)
app.use('/api/users', userRoutes)





// Health check
app.get('/', (req, res) => res.send("API Working"));

// Test Route for Manual User Insertion
app.post('/test-save', async (req, res) => {
    try {
        console.log("📤 Manual Test Data Received:", req.body);
        const newUser = await User.create(req.body);
        console.log("✅ User manually saved:", newUser);
        res.json({ success: true, user: newUser });
    } catch (error) {
        console.error("❌ MongoDB Save Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Port
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
