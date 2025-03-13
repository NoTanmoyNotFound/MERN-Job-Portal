import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
    console.log("➡️ Test Webhook Triggered!");

    console.log("➡️ Request Headers:", req.headers);
    console.log("➡️ Request Body:", JSON.stringify(req.body, null, 2));

    res.status(200).json({ success: true, message: "Received test webhook data", data: req.body });
});

export default router;
