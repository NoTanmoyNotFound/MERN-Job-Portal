import  User  from '../models/User.js';  // Assuming you have the User model set up
import { Svix } from 'svix';
import dotenv from 'dotenv';
dotenv.config();

// Uncomment this to validate the signature (add Clerk's secret key in env)
// const svix = new Svix(process.env.SVIX_SECRET_KEY);

// Function to simulate saving user to MongoDB (adjust according to your setup)
const saveUserToDB = async (firstName, lastName, email, imageUrl, id) => {
    try {
        const newUser = new User({
            _id: id,  // Use Clerk's user ID
            name: `${firstName} ${lastName}`,  // Combine first & last name
            email: email,
            image: imageUrl, // Fix the image field name
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
        console.log("📩 Raw body:", req.body);

        const { type, data } = req.body;
        console.log("🔔 Webhook received:", { type, data });

        if (type === "user.created") {
            const { id, first_name, last_name, email_addresses, image_url } = data;

            // Extract the first email address from the array
            const email = email_addresses?.[0]?.email_address || "";

            // Ensure required fields exist before saving
            if (!id || !first_name || !last_name || !email || !image_url) {
                console.error("🚨 Missing required fields:", { id, first_name, last_name, email, image_url });
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            // Save to MongoDB
            await saveUserToDB(first_name, last_name, email, image_url, id);
            return res.status(200).json({ success: true, message: "User saved successfully" });
        }

        return res.status(400).json({ success: false, message: "Unknown event type" });
    } catch (error) {
        console.error("❌ Webhook error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

