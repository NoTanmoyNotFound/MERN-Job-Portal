import  User  from '../models/User.js';  // Assuming you have the User model set up
import { Svix } from 'svix';
import dotenv from 'dotenv';
dotenv.config();

// Uncomment this to validate the signature (add Clerk's secret key in env)
// const svix = new Svix(process.env.SVIX_SECRET_KEY);

// Function to simulate saving user to MongoDB (adjust according to your setup)
 export const saveUserToDB = async (firstName, lastName, email, imageUrl, id) => {
    try {
        const newUser = new User({
            _id: id,  // Use Clerk's user ID
            name: `${firstName} ${lastName}`,
            email: email,
            image: imageUrl, 
        });

        console.log("Saving user to DB:", newUser);

        await newUser.save();
        console.log("✅ User saved to DB:", newUser);
    } catch (error) {
        console.error("❌ Error saving user to DB:", error);
        throw error;  // Re-throw the error so it can be logged in the webhook handler
    }
};




// Webhook handler
// 

//updated clerkwebhooks
export const clerkWebhooks = async (req, res) => {
    console.log("✅ Clerk Webhook Received:", JSON.stringify(req.body, null, 2));

    try {
        const { type, data } = req.body;
        console.log("📩 Webhook Type:", type);
        console.log("📄 Webhook Data:", JSON.stringify(data, null, 2));

        if (type === "email.created") {
            console.log("📧 Email created event received. Waiting for user creation...");
            return res.status(200).json({ success: true, message: "Email event received, waiting for user.created" });
        }

        if (type === "user.created") {
            console.log("👤 User creation detected!");
            const { id, first_name, last_name, email_addresses, image_url } = data;
            const email = email_addresses?.[0]?.email_address || "";

            console.log("Extracted User Data:", { id, first_name, last_name, email, image_url });

            if (!id || !first_name || !last_name || !email) {
                console.error("🚨 Missing required fields:", { id, first_name, last_name, email });
                return res.status(400).json({ success: false, message: "Missing required fields" });
            }

            await saveUserToDB(first_name, last_name, email, image_url, id);
            console.log("✅ User successfully saved to MongoDB!");
            
            return res.status(200).json({ success: true, message: "User saved successfully" });
        }

        console.warn("⚠️ Unsupported webhook event:", type);
        return res.status(400).json({ success: false, message: "Unsupported webhook event" });

    } catch (error) {
        console.error("❌ Webhook error:", error.stack);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};





