import express from "express";
import { clerkwebhooks } from "../controllers/webhooks.js";
const router = express.Router();

router.post("/clerkwebhooks", async (req, res) => {
    console.log("Webhook received:", req.body); // Debugging log
    await clerkwebhooks(req, res);
});

export default router;
