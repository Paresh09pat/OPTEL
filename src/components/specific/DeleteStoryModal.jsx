import React from 'react';
import { FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

const DeleteStoryModal = ({ isOpen, onClose, onConfirm, storyTitle }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#d3d1d1] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#d3d1d1]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaExclamationTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Story</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this story?
          </p>
          {storyTitle && (
            <p className="text-sm text-gray-500 italic mb-4">
              "{storyTitle}"
            </p>
          )}
          <p className="text-sm text-gray-600">
            This action cannot be undone. The story will be permanently deleted.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-[#d3d1d1] bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-[#d3d1d1] rounded-lg text-gray-700 hover:bg-white transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <FaTrash className="w-4 h-4" />
            Delete Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteStoryModal;

