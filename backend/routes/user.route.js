import express from "express";
import { logoutUser, registerUser } from "../controllers/user.controller.js";
import { loginUser ,getMyProfile,getAdmins} from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/authUser.js";
import { get } from "mongoose";

const router = express.Router();

// User registration route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",authenticateUser, logoutUser);
router.get("/myprofile",authenticateUser, getMyProfile);
router.get("/getadmins", getAdmins);


export default router;