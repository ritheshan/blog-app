import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const createTokenAndSaveCookie = async (userId, res) => {
  try {
    if (!res) {
      throw new Error("Response object (res) is undefined");
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Update User Document with Token
    await User.findByIdAndUpdate(userId, { token });

    // Set cookie options
    const cookieExpiryDays = Number(process.env.COOKIE_EXPIRES_IN) || 7;
    const options = {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: false,
      path: "/",
      expires: new Date(Date.now() + cookieExpiryDays * 24 * 60 * 60 * 1000),
    };

    // ✅ Fix: Ensure `res` is available before setting cookie
    res.cookie("jwt", token, options);
    return token; // Return token for further use
  } catch (error) {
    console.error("Error in creating token:", error);
    if (res) {
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export default createTokenAndSaveCookie;