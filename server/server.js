import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import {clerkwebhooks} from "./controllers/webhooks.js";
import testWebhook from "./controllers/testWebhook.js";


import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Initialize Sentry (if DSN is provided)
if (process.env.SENTRY_DSN) {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
}

// Connect to database
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/webhooks', clerkwebhooks);
app.use('/test-webhook', testWebhook);


// Health check
app.get('/', (req, res) => res.send("API Working"));

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});