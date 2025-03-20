
import { v2 as cloudinary } from 'cloudinary';
import Blog from '../models/blog.model.js';
import User from '../models/user.model.js'; // Assuming User model exists

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create a new blog with Cloudinary upload
export const createBlog = async (req, res) => {
    try {
        const { title,  category, about, createdBy } = req.body;

        if (!blogImage) {
            return res.status(400).json({ message: "Blog image is required." });
        }

        if (about.length < 200) {
            return res.status(400).json({ message: "About section must be at least 200 characters long." });
        }
        const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
        const blogImage = req.file ? req.file : req.files[0];
        
        if (!allowedFormats.includes(blogImage.mimetype)) {
          console.log("Error: Invalid photo format. Only JPEG, JPG, and PNG are allowed");
          return res.status(400).json({ message: "Invalid photo format. Only JPEG, JPG, and PNG are allowed" });
        }

        // Find admin details (assuming 'createdBy' is the user's ID)
        const admin = await User.findById(createdBy);
        if (!admin) {
            return res.status(404).json({ message: "Admin user not found." });
        }

        // Upload image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(blogImage.tempFilePath);

        // Create new blog object
        const newBlog = {
            title,
            blogImage: {
                publicId: uploadResponse.public_id,
                url: uploadResponse.secure_url
            },
            category,
            about,
            adminName: admin.name,
            adminPhoto: admin.photo, // Assuming User model has 'photo' field
            createdBy: admin._id
        };

        // Save new blog in database
        const savedBlog = await Blog.create(newBlog);
        res.status(201).json("blog created successfully",savedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('createdBy', 'name email');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a blog by ID
export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy', 'name email');
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all blogs of the authenticated user
export const getUserBlogs = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from authenticated request

        const blogs = await Blog.find({ createdBy: userId }).sort({ createdAt: -1 }); // Fetch user's blogs, latest first

        if (!blogs.length) {
            return res.status(404).json({ message: "No blogs found for this user." });
        }

        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a blog
export const updateBlog = async (req, res) => {
    try {
        const { title, blogImage, category, about, adminName, adminPhoto } = req.body;

        if (blogImage && (!blogImage.publicId || !blogImage.url)) {
            return res.status(400).json({ message: "Blog image must include publicId and url." });
        }

        if (about && about.length < 200) {
            return res.status(400).json({ message: "About section must be at least 200 characters long." });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
            title,
            blogImage,
            category,
            about,
            adminName,
            adminPhoto
        }, { new: true });

        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

