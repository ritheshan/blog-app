import express from 'express';
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getUserBlogs
} from '../controllers/blog.controller.js';
import { authenticateUser, authorizeAdmin } from '../middleware/authUser.js';

const router = express.Router();

// Create a new blog
router.post('/create', authenticateUser, authorizeAdmin, createBlog);

// Delete a blog by ID
router.delete('/delete/:id',authenticateUser,authorizeAdmin, deleteBlog);

// Get all blogs
router.get('/all-blogs',authenticateUser,getAllBlogs);

// Get a single blog by ID
router.get('/blogbyid/:id', getBlogById);

// get a all blog by admin
router.get('/my-blogs',authenticateUser,authorizeAdmin, getUserBlogs);

// Update a blog by ID
router.put('/update/:id', authenticateUser,authorizeAdmin,updateBlog);



export default router;