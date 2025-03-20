import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    blogImage: {
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true,
        minlength:[ 200 , 'Minimum 200 characters required']
    },
    adminName: {
        type: String,
        required: true
    },
    adminPhoto: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;