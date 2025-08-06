import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/AuthToken.js";
import { v2 as cloudinary } from 'cloudinary';


export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, education, role, password } = req.body;
    console.log(req.body);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "User photo is required" });
    }
    if (!name || !email || !phone || !education || !role || !password) {
      console.log("Error: All required fields must be filled");
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    const photoFile = req.files?.photo;
    if (!photoFile) {
      console.log("Error: User photo is missing");
      return res.status(400).json({ message: "User photo is required" });
    }
    if (!allowedFormats.includes(photoFile.mimetype)) {
      console.log("Error: Invalid photo format");
      return res.status(400).json({ message: "Invalid photo format. Only JPEG, JPG, and PNG are allowed" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Error: User with this email already exists");
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(photoFile.tempFilePath);
    if (!cloudinaryResponse) {
      console.log("Error: Photo upload failed");
      return res.status(500).json({ message: "Photo upload failed" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      education,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("User registered successfully:", newUser);

    // ✅ FIX: Ensure token function doesn't modify res
    try {
      console.log("res before calling createTokenAndSaveCookie:", res);
      const token = await createTokenAndSaveCookie(newUser._id,res);
   
      return res.status(201).json({ message: "User registered successfully", user: newUser, token });
    } catch (tokenError) {
      console.log("Error: Token creation failed", tokenError.message);
      return res.status(500).json({ message: "Token creation failed" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      console.log("Error: Please fill all required fields");
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.log("Error: User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch || user.role !== role) {
      console.log("Error: Invalid email, password, or role");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Remove password from response
    user.password = undefined;

    // Generate token and send response
    await createTokenAndSaveCookie(user._id, res);
    res.status(200).json({
      message: "Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        education: user.education,
        token: user.token,
      },
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// logout user
export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "strict",
  });

  console.log("User logged out successfully");
  res.status(200).json({ message: "Logged out successfully" });
};


// Get logged-in user's profile
export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password"); // Exclude password from response

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users with the "admin" role
export const getAdmins = async (req, res) => {
  try {
      const admins = await User.find({ role: "admin" }).select("-password"); // Exclude passwords

      if (!admins.length) {
          return res.status(404).json({ message: "No admins found." });
      }

      res.status(200).json(admins);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};