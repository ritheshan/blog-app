import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js"; // Import user routes
import blogRoutes from "./routes/blog.route.js"; // Import blog routes
import chatbotRoutes from "./routes/chatbot.route.js"; // Import chatbot routes
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";
import cors from "cors";  

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3002; // Use PORT from .env or default to 3002
const mongoURI = process.env.MONGO_URI; // Get MongoDB URI from .env

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
});

// Middleware to parse JSON
app.use(express.json());

app.use(cookieParser());
console.log(process.env.FRONTEND_URL);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
 
}));

app.use(express.urlencoded({ extended: true }));

// Middleware for file uploads
app.use(fileUpload(
  { useTempFiles: false,
    // createParentPath: true,
    // tempFileDir: "/tmp/",
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
app.use("/api/blogs", blogRoutes); // Mount blog routes
app.use("/api/chatbot", chatbotRoutes); // Mount chatbot routes
//cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

app.get("/", (req, res) => {
  res.send("Hello World with .env and MongoDB!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});