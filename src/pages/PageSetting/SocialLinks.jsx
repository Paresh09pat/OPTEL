// components/SocialLinks.js
import React from 'react';

const SocialLinks = ({ formData, handleChange }) => {

  const validateUrl = (url) => {
    if (!url) return true; // Empty URLs are valid
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="bg-white rounded-xl p-3.5 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">Social Links</h2>
      
      <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook :</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="URL"
              className={`w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                formData.facebook && !validateUrl(formData.facebook) 
                  ? 'border-red-300' 
                  : 'border-[#212121]'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter :</label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="URL"
              className={`w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                formData.twitter && !validateUrl(formData.twitter) 
                  ? 'border-red-300' 
                  : 'border-[#212121]'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram :</label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="URL"
              className={`w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                formData.instagram && !validateUrl(formData.instagram) 
                  ? 'border-red-300' 
                  : 'border-[#212121]'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vkontakte</label>
            <input
              type="url"
              name="vkontakte"
              value={formData.vkontakte}
              onChange={handleChange}
              placeholder="URL"
              className={`w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                formData.vkontakte && !validateUrl(formData.vkontakte) 
                  ? 'border-red-300' 
                  : 'border-[#212121]'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn :</label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="URL"
              className={`w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                formData.linkedin && !validateUrl(formData.linkedin) 
                  ? 'border-red-300' 
                  : 'border-[#212121]'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube :</label>
            <input
              type="url"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
              placeholder="URL"
              className={`w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                formData.youtube && !validateUrl(formData.youtube) 
                  ? 'border-red-300' 
                  : 'border-[#212121]'
              }`}
            />
          </div>
        </div>
    </div>
  );
};

export default SocialLinks;