import React from "react";
import { FaEye, FaShareAlt } from "react-icons/fa";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition">
      {/* Thumbnail */}
      <a href={blog?.url} target="_blank" rel="noopener noreferrer">
        <img
          src={blog?.thumbnail}
          alt={blog?.title}
          className="w-full h-56 object-cover"
        />
      </a>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category & Time */}
        <div className="flex justify-between text-xs text-gray-500">
          <a
            href={blog?.category_link}
            className="hover:text-blue-500 font-medium"
          >
            {blog?.category_name}
          </a>
          <span>{blog?.posted}</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600">
          <a href={blog?.url} target="_blank" rel="noopener noreferrer">
            {blog?.title}
          </a>
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3">
          {blog?.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-1">
          {blog?.tags_array?.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mt-3">
          <img
            src={blog?.author?.avatar}
            alt={blog?.author?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold">{blog?.author?.name}</h3>
            <p className="text-xs text-gray-500">{blog?.author?.gender}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaEye /> {blog?.view} views
            </span>
            <span className="flex items-center gap-1">
              <FaShareAlt /> {blog?.shared} shares
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
