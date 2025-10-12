import React from "react";
import { FaEye, FaShareAlt, FaComment, FaHeart } from "react-icons/fa";

const BlogCard = ({ blog, onClick }) => {
  // Format the posted date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition cursor-pointer" onClick={onClick}>
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={blog?.thumbnail || '/icons/blog.png'}
          alt={blog?.title}
          className="w-full h-56 object-cover"
          onError={(e) => {
            e.target.src = '/icons/blog.png';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category & Time */}
        <div className="flex justify-between text-xs text-gray-500">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            Category {blog?.category}
          </span>
          <span>{formatDate(blog?.posted_at)}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 line-clamp-2">
          {blog?.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {blog?.excerpt}
        </p>

        {/* Author */}
        {blog?.user?.username && (
          <div className="flex items-center gap-3 mt-3">
            <img
              src={blog?.user?.avatar_url || blog?.user?.avatar || '/perimg.png'}
              alt={blog?.user?.username}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = '/perimg.png';
              }}
            />
            <div>
              <h3 className="text-sm font-semibold">{blog?.user?.username}</h3>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaEye /> {blog?.views || 0} views
            </span>
            <span className="flex items-center gap-1">
              <FaShareAlt /> {blog?.shares || 0} shares
            </span>
            <span className="flex items-center gap-1">
              <FaComment /> {blog?.comments || 0} comments
            </span>
            <span className="flex items-center gap-1">
              <FaHeart /> {blog?.reactions || 0} reactions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
