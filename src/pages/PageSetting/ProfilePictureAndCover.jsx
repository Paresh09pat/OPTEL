// components/ProfilePictureAndCover.js
import React, { useState } from 'react';
import { Image, Upload } from 'lucide-react';

const ProfilePictureAndCover = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (type === 'profile') {
            setProfilePicture(e.target.result);
          } else {
            setCoverPicture(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Picture & Cover Data:', {
      profilePicture,
      coverPicture
    });
    // Handle form submission here
  };

  const FileUploadArea = ({ type, image, onChange }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e, type)}
        className="hidden"
        id={`${type}-upload`}
      />
      <label htmlFor={`${type}-upload`} className="cursor-pointer">
        {image ? (
          <div className="space-y-2">
            <img 
              src={image} 
              alt={`${type} preview`} 
              className="max-w-full max-h-32 mx-auto rounded-lg"
            />
            <p className="text-sm text-green-600">Image uploaded successfully</p>
            <p className="text-xs text-gray-500">Click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Image className="w-12 h-12 text-gray-400" />
            <span className="text-gray-500">Select photo</span>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Upload className="w-4 h-4" />
              <span>Click to upload</span>
            </div>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Picture & Cover</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture :</label>
            <FileUploadArea 
              type="profile" 
              image={profilePicture} 
              onChange={handleFileChange} 
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 400x400px. Maximum file size: 2MB.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover :</label>
            <FileUploadArea 
              type="cover" 
              image={coverPicture} 
              onChange={handleFileChange} 
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 1200x400px. Maximum file size: 5MB.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button 
            type="submit"
            className="w-32 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePictureAndCover;