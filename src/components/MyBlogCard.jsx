import React, { useState } from "react";
import { FaEye, FaShareAlt, FaComment, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import EditBlogModal from "./EditBlogModal";

const MyBlogCard = ({ blog, onClick, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  // Format the posted date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation(); // Prevent card click
    setShowEditModal(true);
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (window.confirm('Are you sure you want to delete this blog?')) {
      if (onDelete) {
        await onDelete(blog.id);
      }
    }
  };

  const handleUpdateSuccess = (updatedBlog) => {
    setShowEditModal(false);
    if (onUpdate) {
      onUpdate(updatedBlog);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition cursor-pointer relative group">
        {/* Action Buttons - Show on hover */}
        <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition shadow-lg"
            title="Edit Blog"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
            title="Delete Blog"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="relative" onClick={onClick}>
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
          <h2 className="text-lg font-bold text-gray-900 hover:text-blue-600 line-clamp-2" onClick={onClick}>
            {blog?.title}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-3" onClick={onClick}>
            {blog?.description || blog?.excerpt}
          </p>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              blog?.active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {blog?.active ? 'Active' : 'Draft'}
            </span>
          </div>

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

      {/* Edit Modal */}
      {showEditModal && (
        <EditBlogModal
          blog={blog}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </>
  );
};

export default MyBlogCard;

