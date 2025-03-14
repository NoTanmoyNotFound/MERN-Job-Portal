import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';

import testWebhook from "./controllers/testWebhook.js";
import * as Sentry from "@sentry/node";


import dotenv from 'dotenv';
import { clerkWebhooks } from './controllers/webhooks.js';
dotenv.config();


const app = express();


// Connect to database
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// app.use('/webhooks', clerkwebhooks);
app.use('/test-webhook', testWebhook);
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

app.post('/webhooks',clerkWebhooks)
  


// Health check
app.get('/', (req, res) => res.send("API Working"));

// Port
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});