
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createTokenAndSaveCookie = async (userId, res) => {
  try {
    // Generate JWT Token
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // Update User Document with Token
    await User.findByIdAndUpdate(userId, { token });

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    };

    // Set cookie and send response
    res.cookie("token", token, options).json({
      success: true,
      message: "Token generated, saved in cookie & database",
      token,
    });

    return token;
  } catch (error) {
    console.error("Error in creating token:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default createTokenAndSaveCookie;