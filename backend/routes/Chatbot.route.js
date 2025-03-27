import express from "express";
import { generateBlogContent } from "../controllers/Chatbot.controller.js"; // Import Controller

const router = express.Router();

// Route to Generate AI Blog Content
router.post("/generate-content", generateBlogContent);

export default router;