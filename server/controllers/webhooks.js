import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
    console.log("🔔 Clerk Webhook Triggered");
    console.log("Received Webhook Headers:", req.headers); // Debug headers
    console.log("Received Webhook Body:", JSON.stringify(req.body, null, 2));

    if (!process.env.CLERK_WEBHOOK_SECRET) {
        console.error("❌ Missing Clerk Webhook Secret in .env file");
        return res.status(500).json({ success: false, message: "Missing Clerk Webhook Secret" });
    }

    try {
        const svixHeaders = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body);

        wh.verify(payload, svixHeaders); // Verify webhook signature
        console.log("✅ Clerk Webhook Verified Successfully!");

        const { type, data } = req.body;

        if (!data || !type) {
            console.error("⚠️ Invalid webhook data:", data);
            return res.status(400).json({ success: false, message: "Invalid webhook data" });
        }

        console.log("📌 Webhook Event Type:", type);
        console.log("📦 Webhook Data:", JSON.stringify(data, null, 2));

        if (type === "user.created") {
            try {
                if (!data.id || !data.email_addresses?.[0]?.email) {
                    console.error("⚠️ Missing required user fields:", data);
                    return res.status(400).json({ success: false, message: "Missing required user fields" });
                }

                const newUser = new User({
                    _id: data.id,
                    email: data.email_addresses[0].email,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.profile_image_url || "",
                    resume: "",
                });

                await newUser.save();
                console.log("✅ New User Created:", newUser);
                return res.status(201).json({ success: true, message: "User created successfully" });

            } catch (error) {
                console.error("❌ Error saving user:", error.message);
                return res.status(500).json({ success: false, message: "User creation failed", error: error.message });
            }
        }

        if (type === "user.deleted") {
            try {
                const deletedUser = await User.findByIdAndDelete(data.id);
                if (!deletedUser) {
                    console.error("⚠️ User not found for deletion:", data.id);
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                console.log("✅ User deleted:", data.id);
                return res.status(200).json({ success: true, message: "User deleted successfully" });
            } catch (error) {
                console.error("❌ Error deleting user:", error.message);
                return res.status(500).json({ success: false, message: "Error deleting user", error: error.message });
            }
        }

        console.warn("⚠️ Unhandled Clerk Webhook Event:", type);
        return res.status(400).json({ success: false, message: "Unhandled webhook event type" });

    } catch (error) {
        console.error("❌ Webhook Verification Error:", error.message);
        return res.status(400).json({ success: false, message: "Webhook verification failed", error: error.message });
    }
};
