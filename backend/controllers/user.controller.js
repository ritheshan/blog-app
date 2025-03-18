import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, photo, education, role, password } = req.body;

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      photo,
      education,
      role,
      password,
    });

    await newUser.save();

    console.log("User registered:", newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};