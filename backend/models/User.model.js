import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phone: {
    type: Number,
    required: true,
  },
  photo: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  education: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    required: true,
    select: false, // Ensures password is not returned in queries
    minlength: 8, // Minimum password length
  },
  createdAt: { type: Date, default: Date.now },
  token: {
    type: String,
  }
});

const User = mongoose.model("User", userSchema, 'users');
export default User;