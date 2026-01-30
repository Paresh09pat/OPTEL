// components/ProfilePictureAndCover.js
import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProfilePictureAndCover = ({ pageData, onImageChange }) => {
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [currentCover, setCurrentCover] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [viewModal, setViewModal] = useState({ open: false, type: null, url: null });
  
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Default fallback images
  const DEFAULT_AVATAR = 'https://admin.ouptel.in/images/placeholders/page-avatar.svg';
  const DEFAULT_COVER = 'https://admin.ouptel.in/storage/upload/photos/d-cover.jpg';

  // Fetch page data when component mounts or pageData changes
  useEffect(() => {
    if (pageData) {
      setCurrentAvatar(pageData.avatar_url || pageData.avatar || null);
      setCurrentCover(pageData.cover_url || pageData.cover || null);
      setAvatarError(false);
      setCoverError(false);
    }
  }, [pageData]);

  const handleImageSelect = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    console.log(`Selected ${type}:`, file.name, file.type, file.size);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'avatar') {
        setAvatar(file);
        setAvatarPreview(e.target.result);
        // Notify parent component about the change
        if (onImageChange) {
          console.log('Notifying parent about avatar change');
          onImageChange('avatar', file);
        }
      } else {
        setCover(file);
        setCoverPreview(e.target.result);
        // Notify parent component about the change
        if (onImageChange) {
          console.log('Notifying parent about cover change');
          onImageChange('cover', file);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = (type) => {
    if (type === 'avatar') {
      setAvatar(null);
      setAvatarPreview(null);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
      // Notify parent component about the change
      if (onImageChange) {
        onImageChange('avatar', null);
      }
    } else {
      setCover(null);
      setCoverPreview(null);
      if (coverInputRef.current) coverInputRef.current.value = '';
      // Notify parent component about the change
      if (onImageChange) {
        onImageChange('cover', null);
      }
    }
  };

  const openViewModal = (type, url) => {
    setViewModal({ open: true, type, url });
  };

  const closeViewModal = () => {
    setViewModal({ open: false, type: null, url: null });
  };

  return (
    <>
      <div className="bg-white rounded-xl p-3.5 border border-[#808080]">
        <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">
          Profile Picture & Cover
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Picture Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture :</label>
            
            {/* Current Avatar Display */}
            {currentAvatar && !avatarPreview && (
              <div className="mb-4">
                <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={avatarError ? DEFAULT_AVATAR : currentAvatar}
                    alt="Current Profile Picture" 
                    className="w-full h-full object-contain"
                    onError={() => setAvatarError(true)}
                  />
                  <button
                    onClick={() => openViewModal('avatar', avatarError ? DEFAULT_AVATAR : currentAvatar)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                    title="View full image"
                  >
                    <FiEye className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="relative">
              <div 
                className="w-full h-48 border-2 border-dashed border-[#212121] rounded-3xl flex items-center justify-center cursor-pointer hover:border-[#1153e7] transition-colors"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <div className="relative w-full h-full bg-gray-50 flex items-center justify-center rounded-3xl">
                    <img 
                      src={avatarPreview} 
                      alt="Profile Picture Preview" 
                      className="w-full h-full object-contain rounded-3xl"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" className="mx-auto mb-2">
                      <path fill="#808080" d="M18 15v3h-3v2h3v3h2v-3h3v-2h-3v-3zm-4.7 6H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8.3c-.6-.2-1.3-.3-2-.3c-1.1 0-2.2.3-3.1.9L14.5 12L11 16.5l-2.5-3L5 18h8.1c-.1.3-.1.7-.1 1c0 .7.1 1.4.3 2"></path>
                    </svg>
                    <p className="text-[#808080] text-sm">Select photo</p>
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
            
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 400x400px. Maximum file size: 5MB.
            </p>
          </div>

          {/* Cover Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover :</label>
            
            {/* Current Cover Display */}
            {currentCover && !coverPreview && (
              <div className="mb-4">
                <div className="relative w-full h-48 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={coverError ? DEFAULT_COVER : currentCover}
                    alt="Current Cover" 
                    className="w-full h-full object-contain"
                    onError={() => setCoverError(true)}
                  />
                  <button
                    onClick={() => openViewModal('cover', coverError ? DEFAULT_COVER : currentCover)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                    title="View full image"
                  >
                    <FiEye className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="relative">
              <div 
                className="w-full h-48 border-2 border-dashed border-[#212121] rounded-3xl flex items-center justify-center cursor-pointer hover:border-[#1153e7] transition-colors"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <div className="relative w-full h-full bg-gray-50 flex items-center justify-center rounded-3xl">
                    <img 
                      src={coverPreview} 
                      alt="Cover Preview" 
                      className="w-full h-full object-contain rounded-3xl"
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
                    <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" className="mx-auto mb-2">
                      <path fill="#808080" d="M18 15v3h-3v2h3v3h2v-3h3v-2h-3v-3zm-4.7 6H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8.3c-.6-.2-1.3-.3-2-.3c-1.1 0-2.2.3-3.1.9L14.5 12L11 16.5l-2.5-3L5 18h8.1c-.1.3-.1.7-.1 1c0 .7.1 1.4.3 2"></path>
                    </svg>
                    <p className="text-[#808080] text-sm">Select photo</p>
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
            
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 1200x400px. Maximum file size: 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* View Image Modal */}
      {viewModal.open && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeViewModal}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <button
              onClick={closeViewModal}
              className="absolute -top-12 right-0 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-700" />
            </button>
            <img 
              src={viewModal.url}
              alt={viewModal.type === 'avatar' ? 'Profile Picture' : 'Cover'}
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePictureAndCover;
