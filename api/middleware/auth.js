import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Not authorized - User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Not authorized - Invalid or expired token" });
        }

        return res.status(500).json({ success: false, message: "Server error" });
    }
};