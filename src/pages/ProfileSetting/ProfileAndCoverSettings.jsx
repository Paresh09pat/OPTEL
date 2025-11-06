import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiCamera, FiImage, FiX } from 'react-icons/fi';

const ProfileAndCoverSettings = () => {
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState({ avatar: false, cover: false });
  
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleImageSelect = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'avatar') {
        setAvatar(file);
        setAvatarPreview(e.target.result);
      } else {
        setCover(file);
        setCoverPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);

    // Clear error and success messages
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async (type) => {
    const file = type === 'avatar' ? avatar : cover;
    if (!file) {
      setError(`Please select a ${type} image first`);
      return;
    }

    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      const endpoint = type === 'avatar' 
        ? `${import.meta.env.VITE_API_URL}/api/v1/design/avatar`
        : `${import.meta.env.VITE_API_URL}/api/v1/design/cover`;

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
        }
      });

      const data = response.data;
      
      if (data.api_status === '200') {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        
        // Clear the selected file after successful upload
        if (type === 'avatar') {
          setAvatar(null);
          setAvatarPreview(null);
          if (avatarInputRef.current) avatarInputRef.current.value = '';
        } else {
          setCover(null);
          setCoverPreview(null);
          if (coverInputRef.current) coverInputRef.current.value = '';
        }
      } else {
        throw new Error(data.api_text || `Failed to upload ${type}`);
      }
    } catch (err) {
      console.error(`Error uploading ${type}:`, err);
      setError(`Failed to upload ${type}. Please try again.`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleReset = async (type) => {
    try {
      setUploading(prev => ({ ...prev, [type]: true }));
      setError(null);

      const endpoint = type === 'avatar' 
        ? `${import.meta.env.VITE_API_URL}/api/v1/design/avatar/reset`
        : `${import.meta.env.VITE_API_URL}/api/v1/design/cover/reset`;

      const response = await axios.post(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
        }
      });

      const data = response.data;
      
      if (data.api_status === '200') {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        
        // Clear previews after successful reset
        if (type === 'avatar') {
          setAvatar(null);
          setAvatarPreview(null);
          if (avatarInputRef.current) avatarInputRef.current.value = '';
        } else {
          setCover(null);
          setCoverPreview(null);
          if (coverInputRef.current) coverInputRef.current.value = '';
        }
      } else {
        throw new Error(data.api_text || `Failed to reset ${type}`);
      }
    } catch (err) {
      console.error(`Error resetting ${type}:`, err);
      setError(`Failed to reset ${type}. Please try again.`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const clearSelection = (type) => {
    if (type === 'avatar') {
      setAvatar(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    } else {
      setCover(null);
      setCoverPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">
        Profile Picture & Cover
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
          <div className="relative">
            <div 
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => avatarInputRef.current?.click()}
            >
              {avatarPreview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={avatarPreview} 
                    alt="Profile Picture Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection('avatar');
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FiCamera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Click to upload profile picture</p>
                </div>
              )}
            </div>
            
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect('avatar', e)}
              className="hidden"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleUpload('avatar')}
              disabled={!avatar || uploading.avatar}
              className={`flex-1 px-4 py-2 border border-purple-500 text-purple-500 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold ${
                !avatar || uploading.avatar ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
              }`}
            >
              {uploading.avatar ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload'
              )}
            </button>
            
            <button
              onClick={() => handleReset('avatar')}
              disabled={uploading.avatar}
              className={`px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-semibold ${
                uploading.avatar ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              {uploading.avatar ? 'Resetting...' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Cover Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Cover</h3>
          <div className="relative">
            <div 
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
              onClick={() => coverInputRef.current?.click()}
            >
              {coverPreview ? (
                <div className="relative w-full h-full">
                  <img 
                    src={coverPreview} 
                    alt="Cover Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection('cover');
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Click to upload cover</p>
                </div>
              )}
            </div>
            
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect('cover', e)}
              className="hidden"
            />
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => handleUpload('cover')}
              disabled={!cover || uploading.cover}
              className={`flex-1 px-4 py-2 border border-purple-500 text-purple-500 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold ${
                !cover || uploading.cover ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
              }`}
            >
              {uploading.cover ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload'
              )}
            </button>
            
            <button
              onClick={() => handleReset('cover')}
              disabled={uploading.cover}
              className={`px-4 py-2 border border-gray-300 text-gray-600 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-semibold ${
                uploading.cover ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              {uploading.cover ? 'Resetting...' : 'Reset'}
            </button>
          </div>
        </div>
      </div>
      
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">Image updated successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileAndCoverSettings;