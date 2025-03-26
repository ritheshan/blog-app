import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateBlogContent = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Blog title is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Write a detailed blog post on the topic: "${title}". 
    Include an introduction, main points, and conclusion.`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    res.json({ content });
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    res.status(500).json({ error: "Failed to generate content", details: error.message });
  }
};