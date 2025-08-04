import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/User.route.js"; // Import user routes
import blogRoutes from "./routes/Blog.route.js"; // Import blog routes
import chatbotRoutes from "./routes/Chatbot.route.js"; // Import chatbot routes
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from "cookie-parser";
import cors from "cors";  
import morgan from "morgan"; // Import morgan for logging

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


// Configure CORS for development and production
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://blog-app-xi-sandy-36.vercel.app",
  "https://blogapp-git-main-ritheshs-projects-d70ba336.vercel.app",
  "https://blogapp-ngm3bjyus-ritheshs-projects-d70ba336.vercel.app",
  // Add any additional production/staging URLs here
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
  optionsSuccessStatus: 204
}));

app.use(express.urlencoded({ extended: true }));
// Middleware for logging requests
app.use(morgan("dev")); // Use morgan to log requests in development mode

// Middleware for file uploads
app.use(fileUpload(
  { useTempFiles: true,
    // createParentPath: true,
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

// Health check route for monitoring
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    service: "blog-app-backend"
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});