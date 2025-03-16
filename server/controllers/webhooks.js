import  User  from '../models/User.js';  // Assuming you have the User model set up
import { Svix } from 'svix';
import dotenv from 'dotenv';
dotenv.config();

// Uncomment this to validate the signature (add Clerk's secret key in env)
// const svix = new Svix(process.env.SVIX_SECRET_KEY);

// Function to simulate saving user to MongoDB (adjust according to your setup)
const saveUserToDB = async (userId, firstName, lastName, email, imageUrl) => {
    try {
        const name = `${firstName} ${lastName}`.trim();

        console.log("📩 Saving user data:", { userId, name, email, imageUrl });

        if (!email) {
            console.log("❌ No email found, skipping save.");
            return;
        }

        // Check if user exists before creating
        const existingUser = await User.findById(userId);
        if (existingUser) {
            console.log("⚠️ User already exists in DB:", existingUser);
            return;
        }

        const newUser = new User({
            _id: userId, // Use Clerk ID as _id
            name,
            email,
            image: imageUrl
        });

        await newUser.save();
        console.log("✅ User saved to DB:", newUser);
    } catch (error) {
        console.error("❌ Error saving user to DB:", error);
    }
};



// Webhook handler
// 

//updated clerkwebhooks
export const clerkWebhooks = async (req, res) => {
    try {
        console.log("📩 Webhook received:", JSON.stringify(req.body, null, 2));

        const { type, data } = req.body;

        if (type === "user.created") {
            const { id, first_name, last_name, email_addresses, image_url } = data;
            const email = email_addresses.length > 0 ? email_addresses[0].email_address : "";

            console.log("📤 Extracted user data:", { id, first_name, last_name, email, image_url });

            await saveUserToDB(id, first_name, last_name, email, image_url);
            return res.status(200).json({ success: true });
        }

        console.log("⚠️ Unknown event type:", type);
        return res.status(400).json({ success: false, message: "Unknown event type" });

    } catch (error) {
        console.error("❌ Webhooks error:", error);
        return res.status(500).json({ success: false, message: "Webhooks error" });
    }
};
