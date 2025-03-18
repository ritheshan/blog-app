import express from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = express.Router();

// User registration route
router.post("/register", registerUser);

export default router;