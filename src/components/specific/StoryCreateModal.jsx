import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaImage, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StoryCreateModal = ({ isOpen, onClose, onStoryCreated }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyDescription, setStoryDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setStoryTitle('');
      setStoryDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type (only images)
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select an image file');
      return;
    }

    if (!storyTitle.trim()) {
      toast.error('Please enter a story title');
      return;
    }

    if (!storyDescription.trim()) {
      toast.error('Please enter a story description');
      return;
    }

    setLoading(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      const formData = new FormData();
      
      formData.append('file', file);
      formData.append('file_type', 'image');
      formData.append('story_title', storyTitle.trim());
      formData.append('story_description', storyDescription.trim());

      const response = await fetch('https://admin.ouptel.in/api/v1/stories/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.ok !== false) {
        toast.success('Story created successfully!');
        // Callback to refresh stories
        if (onStoryCreated) {
          onStoryCreated();
        }
        onClose();
        // Reset form
        setFile(null);
        setPreview(null);
        setStoryTitle('');
        setStoryDescription('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
      } else {
        toast.error(data?.message || data?.errors?.error_text || 'Failed to create story');
      }
    } catch (error) {
      console.error('Error creating story:', error);
      toast.error('An error occurred while creating the story');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#d3d1d1] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#d3d1d1]">
          <h2 className="text-xl font-semibold text-gray-900">Create Story</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Image <span className="text-red-500">*</span>
            </label>
            {!preview ? (
              <div
                className="border-2 border-dashed border-[#d3d1d1] rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FaImage className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Story Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              placeholder="Enter story title"
              className="w-full px-4 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Story Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={storyDescription}
              onChange={(e) => setStoryDescription(e.target.value)}
              placeholder="Enter story description"
              rows="3"
              className="w-full px-4 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#d3d1d1] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file || !storyTitle.trim() || !storyDescription.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaUpload className="w-4 h-4" />
                  Create Story
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryCreateModal;

