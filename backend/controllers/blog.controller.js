
import { v2 as cloudinary } from 'cloudinary';
import Blog from '../models/blog.model.js';
import User from '../models/user.model.js'; // Assuming User model exists


export const createBlog = async (req, res) => {
    try {
        const { title, category, about, createdBy } = req.body;

        // Ensure all required fields are present
        if (!title || !category || !about || !createdBy) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (about.length < 200) {
            return res.status(400).json({ message: "About section must be at least 200 characters long." });
        }

        const blogImage = req.files?.blogImage;

        if (!blogImage) {
            return res.status(400).json({ message: "Blog image is required." });
        }

        const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedFormats.includes(blogImage.mimetype)) {
            return res.status(400).json({ message: "Invalid photo format. Only JPEG, JPG, and PNG are allowed." });
        }

        // Find the admin user who is creating the blog
        const admin = await User.findById(createdBy);
        if (!admin) {
            return res.status(404).json({ message: "Admin user not found." });
        }

        // Upload image to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: "blogs" }, (error, result) => {
              if (error) return reject(error);
              return resolve(result);
            });
          
            stream.end(blogImage.data); // Upload from memory
          }); // Upload from memory buffer

        // Create new blog object
        const newBlog = new Blog({
            title,
            blogImage: {
                publicId: uploadResponse.public_id,
                url: uploadResponse.secure_url
            },
            category,
            about,
            adminName: admin.name,
            adminPhoto: admin.photo, // Assuming User model has a 'photo' field
            createdBy: admin._id
        });

        // Save the blog to the database
        const savedBlog = await newBlog.save();
        
        res.status(201).json({ message: "Blog created successfully", blog: savedBlog });

    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
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

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('createdBy', 'name email photo');

        const modifiedBlogs = blogs.map(blog => ({
            _id: blog._id,
            title: blog.title,
            blogImage: blog.blogImage,
            category: blog.category,
            about: blog.about,
            adminName: blog.createdBy.name,
            adminPhoto: blog.createdBy.photo ? { url: blog.createdBy.photo } : null,  // Ensure object format
            createdBy: blog.createdBy._id
        }));

        res.status(200).json(modifiedBlogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('createdBy', 'name email photo');
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        // Convert adminPhoto to an object
        const modifiedBlog = {
            ...blog._doc,
            adminPhoto: { url: blog.adminPhoto }
        };

        res.status(200).json(modifiedBlog);
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

