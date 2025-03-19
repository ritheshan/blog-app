import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to authenticate user using JWT from cookies
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Get token from cookies

        if (!token) {
            return res.status(401).json({ message: "No token provided. Unauthorized." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found. Unauthorized." });
        }
        req.user = user;

        next(); // Proceed to the next middleware or route
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Middleware to check if authenticated user is an admin
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};