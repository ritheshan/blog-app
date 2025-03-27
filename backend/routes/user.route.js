import express from "express";
import { logoutUser, registerUser } from "../controllers/User.controller.js";
import { loginUser ,getMyProfile,getAdmins} from "../controllers/User.controller.js";
import { authenticateUser } from "../middleware/AuthUser.js";


const router = express.Router();

// User registration route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",authenticateUser, logoutUser);
router.get("/my-profile",authenticateUser, getMyProfile);
router.get("/admins", getAdmins);


export default router;