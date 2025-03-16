import jwt from "jsonwebtoken";
import Company from "../models/Company.js";

export const protectCompany = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, login again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const company = await Company.findById(decoded.id).select("-password");

        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        req.company = company;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        return res.status(401).json({ success: false, message: "Invalid token, please login again" });
    }
};
