import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

function CreateBlog() {
  const { profile } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [about, setAbout] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [blogImagePreview, setBlogImagePreview] = useState("");
  const [loadingAI, setLoadingAI] = useState(false); // AI loading state

  const handleGenerateContent = async () => {
    if (!title) {
      return toast.error("Enter a blog title first!");
    }
    setLoadingAI(true);

    try {
      const { data } = await axios.post("${process.env.REACT_APP_BACKEND_URL}/api/chatbot/generate-content", { title });
      setAbout(data.content);
      toast.success("AI-generated content added! Feel free to edit.");
    } catch (error) {
      toast.error("Failed to generate content.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!title || !category || !about) {
      return toast.error("All fields are required!");
    }
    if (about.length < 200) {
      return toast.error("About section must be at least 200 characters long.");
    }
    if (!blogImage) {
      return toast.error("Please upload a blog image.");
    }
  
    if (!profile?._id) {
      console.error("Authentication error: profile.user._id is missing", profile);
      return toast.error("User is not authenticated!");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("about", about);
    formData.append("createdBy", profile?._id);
    formData.append("blogImage", blogImage);

    try {
      const { data } = await axios.post(
        "${process.env.REACT_APP_BACKEND_URL}/api/blogs/create",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message || "Blog created successfully!");
      setTitle(""); setCategory(""); setAbout(""); setBlogImage(null); setBlogImagePreview("");
    } catch (error) {
      console.error("Blog creation error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-8">Create Blog</h3>
        <form onSubmit={handleCreateBlog} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none">
              <option value="">Select Category</option>
              <option value="Devotion">Devotion</option>
              <option value="Sports">Sports</option>
              <option value="Coding">Coding</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Title</label>
            <input type="text" placeholder="Enter your blog title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"/>
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Blog Image</label>
            <div className="flex items-center justify-center">
              <img src={blogImagePreview || "/imgPL.webp"} alt="Preview" className="w-full max-w-sm h-auto rounded-md object-cover"/>
            </div>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setBlogImage(file);
                setBlogImagePreview(URL.createObjectURL(file));
              }
            }} className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"/>
          </div>

          {/* AI Content Generation Button */}
          <div className="space-y-2">
            <label className="block text-lg">About</label>
            <textarea rows="5" placeholder="Write something about your blog" value={about} onChange={(e) => setAbout(e.target.value)} className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"/>
            
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-md"
              onClick={handleGenerateContent}
              disabled={loadingAI}
            >
              {loadingAI ? "Generating..." : "Generate with AI"}
            </button>
          </div>

          <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
            Post Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;