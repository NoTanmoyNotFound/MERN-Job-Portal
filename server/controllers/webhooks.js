import  User  from '../models/User.js';  // Assuming you have the User model set up
import { Svix } from 'svix';
import dotenv from 'dotenv';
dotenv.config();

// Uncomment this to validate the signature (add Clerk's secret key in env)
// const svix = new Svix(process.env.SVIX_SECRET_KEY);

// Function to simulate saving user to MongoDB (adjust according to your setup)
const saveUserToDB = async (firstName, lastName, email, imageUrl) => {
    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            imageUrl,
        });
        await newUser.save();
        console.log("User saved to DB:", newUser);
    } catch (error) {
        console.error("Error saving user to DB:", error);
    }
};

// Webhook handler
export const clerkWebhooks = async (req, res) => {
    try {
        // Log the raw body for debugging (you can remove this after testing)
        console.log("Raw body:", req.body);

        // Skip the signature verification for testing (comment out the following lines)
        // const isValid = svix.webhooks.verifyHeader(
        //     req.headers['svix-signature'],
        //     req.headers['svix-id'],
        //     req.headers['svix-timestamp'],
        //     req.body
        // );
        
        // if (!isValid) {
        //     return res.status(400).json({ success: false, message: "Invalid Signature" });
        // }

        // Parse and handle webhook data
        const { type, data } = req.body;
        console.log("Webhook received:", { type, data });

        // Handle the user.created event
        if (type === "user.created") {
            const { first_name, last_name, email_addresses, image_url } = data;

            // Assuming email_addresses is an array, we extract the first email address
            const email = email_addresses.length > 0 ? email_addresses[0].email_address : "";

            // Save the user to the database
            await saveUserToDB(first_name, last_name, email, image_url);
            return res.status(200).json({ success: true });
        }

        // Handle any unknown event types
        return res.status(400).json({ success: false, message: "Unknown event type" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "webhooks error" });
    }
};
