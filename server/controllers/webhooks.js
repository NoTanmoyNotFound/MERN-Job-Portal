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
    try {
        console.log("📩 Webhook Received:", JSON.stringify(req.body, null, 2));
        const { type, data } = req.body;

        if (type !== "user.created") {
            return res.status(400).json({ success: false, message: "Unknown event type" });
        }

        const { id, first_name, last_name, email_addresses, image_url } = data;
        const email = Array.isArray(email_addresses) && email_addresses.length > 0 
            ? email_addresses[0].email_address 
            : "";

        if (!id || !first_name || !last_name || !email || !image_url) {
            console.error("🚨 Missing required fields:", { id, first_name, last_name, email, image_url });
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if user exists & update, otherwise create new
        const existingUser = await User.findOne({ _id: id });
        if (existingUser) {
            console.log("🔄 User already exists, updating...");
            await User.findOneAndUpdate(
                { _id: id },
                { name: `${first_name} ${last_name}`, email, image: image_url },
                { new: true }
            );
            return res.status(200).json({ success: true, message: "User updated successfully" });
        }

        const newUser = new User({
            _id: id,
            name: `${first_name} ${last_name}`,
            email: email,
            image: image_url,
        });

        console.log("📌 Saving new user:", newUser);
        await newUser.save();
        console.log("✅ User saved to DB:", newUser);

        return res.status(200).json({ success: true, message: "User saved successfully" });

    } catch (error) {
        if (error.code === 11000) {
            console.error("⚠️ Duplicate user detected:", error);
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        console.error("❌ Webhook error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};



