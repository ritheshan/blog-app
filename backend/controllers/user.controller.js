import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, education, role, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !education || !role || !password) {
      console.log("Error: All required fields must be filled");
      return res.status(400).json({ message: "All required fields must be filled" });
    }
    
    // Validate photo upload
    if (!req.file && (!req.files || req.files.length === 0)) {
      console.log("Error: User photo is required");
      return res.status(400).json({ message: "User photo is required" });
    }
    
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    const photoFile = req.file ? req.file : req.files[0];
    
    if (!allowedFormats.includes(photoFile.mimetype)) {
      console.log("Error: Invalid photo format. Only JPEG, JPG, and PNG are allowed");
      return res.status(400).json({ message: "Invalid photo format. Only JPEG, JPG, and PNG are allowed" });
    }
    
    const photo = photoFile.path; // Get photo path

    //cloudinary upload resoponses
    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath); 
    if(!cloudinaryResponse){
      console.log("Error: Photo upload failed");
      return res.status(500).json({ message: "Photo upload failed" });
    }
const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
     const newUser = new User({
    name,
    email,
    phone,
    photo: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.url
    },
    education,
    role,
    password: hashedPassword,
  });
    await newUser.save();

    console.log("User registered:", newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
