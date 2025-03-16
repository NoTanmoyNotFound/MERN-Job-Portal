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

import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

dotenv.config();

const app = express();

// ✅ Connect to Database
await connectDB();
mongoose.connection.once("open", () => {
    console.log("✅ MongoDB Connected Successfully!");
});
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB Connection Error:", err);
});

// ✅ Connect Cloudinary
await connectCloudinary();

// ✅ Middlewares
app.use(cors());
app.use(express.json());  // Ensures JSON body parsing
app.use(clerkMiddleware());  // Clerk authentication

// ✅ Webhook Route - Ensure JSON is parsed before using Clerk Webhook
app.post("/api/webhook", async (req, res) => {
    try {
        console.log("📩 Webhook Received:", req.body);

        if (req.body.type === "user.deleted") {
            const { id } = req.body.data;

            // Find and delete user from DB
            const deletedUser = await User.findOneAndDelete({ clerkId: id });

            if (!deletedUser) {
                console.log("❌ User not found:", id);
                return res.status(404).json({ success: false, message: "User not found" });
            }

            console.log("✅ User deleted:", id);
            return res.status(200).json({ success: true, message: "User deleted successfully" });
        }

        return res.status(400).json({ success: false, message: "Unsupported webhook event" });

    } catch (error) {
        console.error("❌ Webhook processing error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// ✅ Test Webhook Route
app.use('/test-webhook', testWebhook);

// ✅ User Routes
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

// ✅ Fetch Users (Debugging)
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Manual Test Route for MongoDB Insertion
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

// ✅ Health Check
app.get('/', (req, res) => res.send("API Working"));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
