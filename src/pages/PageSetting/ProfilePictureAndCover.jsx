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
    <div className=" border border-[#212121] rounded-3xl p-8 text-center hover:border-orange-400 transition-colors">
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
              className="max-w-full max-h-32 mx-auto rounded-3xl"
            />
            <p className="text-sm text-green-600">Image uploaded successfully</p>
            <p className="text-xs text-gray-500">Click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24"><path fill="#808080" d="M18 15v3h-3v2h3v3h2v-3h3v-2h-3v-3zm-4.7 6H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8.3c-.6-.2-1.3-.3-2-.3c-1.1 0-2.2.3-3.1.9L14.5 12L11 16.5l-2.5-3L5 18h8.1c-.1.3-.1.7-.1 1c0 .7.1 1.4.3 2"></path></svg>
            {/* <Image className="w-12 h-12 text-gray-400" /> */}
            <span className="text-[#808080] text-sm">Select photo</span>
           
          </div>
        )}
      </label>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-3.5 px-9 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">Profile Picture & Cover</h2>
      
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