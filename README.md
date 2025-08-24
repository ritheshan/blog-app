# Blog-App 

## Overview

Blog-App is a full-stack blog application built using the MERN (MongoDB, Express, React, Node.js) stack, offering a comprehensive platform for users to create, manage, and explore blog content with an innovative AI-powered content generation feature.

## 🚀 Features

### Core Functionality
- 👤 User Authentication (Register & Login)
- ✍️ Create, Edit, Delete, and View Blogs
- 🗂️ Category-Based Blog Listing
- 🤖 Optional AI Content Generation
- 📊 User Dashboard & Profile Management

### Unique Sections
- 🔥 Trending Blogs
- 📖 Devotional Section
- 👥 Popular Creators Showcase

### Technical Highlights
- 🔒 Secure Authentication with JWT
- 🖼️ Image Upload with Cloudinary
- 🧠 AI Content Generation using Google Gemini API
- 🛡️ Protected Routes
- 📱 Responsive Design

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- JSON Web Token (JWT)
- express-fileupload
- Cloudinary

### AI Integration
- Google Gemini API

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/blog-app.git
cd blog-app
```

### 2. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables
Create `.env` files in both `backend` and `frontend` directories with the following variables:

#### Backend `.env`
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run the Application
```bash
# Start backend server (from backend directory)
npm run start

# Start frontend development server (from frontend directory)
npm run dev
```

## 🌐 API Endpoints

### User Authentication
- `POST /api/users/register` - User Registration
- `POST /api/users/login` - User Login
- `GET /api/users/profile` - Get User Profile

### Blog Management
- `POST /api/blogs/create` - Create New Blog
- `GET /api/blogs/all` - Retrieve All Blogs
- `GET /api/blogs/my-blogs` - Get User's Blogs
- `PUT /api/blogs/update/:id` - Update Blog
- `DELETE /api/blogs/delete/:id` - Delete Blog

### AI Content Generation
- `POST /api/chatbot/generate-content` - Generate Blog Content

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.


---

**Happy Blogging!** 🎉📝