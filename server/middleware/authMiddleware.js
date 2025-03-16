import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
    try {
        console.log("Headers Received:", req.headers); // Debugging Log

        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("No token found or incorrect format"); // Debugging Log
            return res.status(401).json({ success: false, message: "No token provided, login again" });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract token properly
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging Log

        const company = await Company.findById(decoded.id).select("-password");
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        req.company = company; // ✅ Attach company object to request
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ success: false, message: "Invalid token, please login again" });
    }
};
