import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import Sidebar from "../dashboard/Sidebar";
import MyProfile from "../dashboard/MyProfile";
import MyBlogs from "../dashboard/MyBlogs";
import CreateBlog from "../dashboard/CreateBlog";
import UpdateBlog from "../dashboard/UpdateBlog";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const { profile, isAuthenticated } = useAuth();
  const [component, setComponent] = useState("My Blogs");

  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed on the left */}
      <div className="w-64 bg-gray-800 text-white min-h-screen fixed">
        <Sidebar component={component} setComponent={setComponent} />
      </div>

      {/* Main Content - Adds margin to avoid overlap */}
      <div className="flex-1 ml-64 p-6">
        {component === "My Profile" ? (
          <MyProfile />
        ) : component === "Create Blog" ? (
          <CreateBlog />
        ) : component === "Update Blog" ? (
          <UpdateBlog />
        ) : (
          <MyBlogs />
        )}
      </div>
    </div>
  );
}

export default Dashboard;