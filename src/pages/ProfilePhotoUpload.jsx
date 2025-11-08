import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiX, FiPlus } from 'react-icons/fi';

const ProfilePhotoUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      // Skip photo upload and go to next page
      navigate('/tell-us-about-you');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/design/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.api_status === "200") {
        navigate('/tell-us-about-you');
      } else {
        setError(data.message || 'Failed to upload photo. You can skip and continue.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Upload failed. You can skip and continue.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/tell-us-about-you');
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-[#d3d1d1] p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Add a photo.
          </h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Show your unique personality and style.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Upload Area */}
          <div className="mb-8">
            {preview ? (
              <div className="relative w-48 h-48 mx-auto">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  aria-label="Remove photo"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center cursor-pointer hover:border-[#1d60eb] transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="relative mb-2">
                  <FiCamera className="w-10 h-10 text-gray-400" />
                  <FiPlus className="w-5 h-5 text-gray-400 absolute -bottom-1 -right-1 bg-white rounded-full" />
                </div>
                <p className="text-sm text-gray-600">Upload your photo</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSkip}
              className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-[#1d60eb] text-white rounded-lg font-medium hover:bg-[#1a4fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d60eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Uploading...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;

