import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js"; // Import user routes
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';


dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3002; // Use PORT from .env or default to 3002
const mongoURI = process.env.MONGO_URI; // Get MongoDB URI from .env

// Middleware to parse JSON
app.use(express.json());

// Middleware for file uploads
app.use(fileUpload(
  {
    createParentPath: true,
    tempFileDir: "/tmp/",
  }
));

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/users", userRoutes); // Mount user routes

//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.get("/", (req, res) => {
  res.send("Hello World with .env and MongoDB!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});