// components/SocialLinks.js
import React, { useState } from 'react';

const SocialLinks = () => {
  const [formData, setFormData] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    vkontakte: '',
    linkedin: '',
    youtube: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Social Links Data:', formData);
    // Handle form submission here
  };

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
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Social Links</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook :</label>
            <input
              type="url"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="URL"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formData.facebook && !validateUrl(formData.facebook) 
                  ? 'border-red-300' 
                  : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formData.twitter && !validateUrl(formData.twitter) 
                  ? 'border-red-300' 
                  : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formData.instagram && !validateUrl(formData.instagram) 
                  ? 'border-red-300' 
                  : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formData.vkontakte && !validateUrl(formData.vkontakte) 
                  ? 'border-red-300' 
                  : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formData.linkedin && !validateUrl(formData.linkedin) 
                  ? 'border-red-300' 
                  : 'border-gray-300'
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
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                formData.youtube && !validateUrl(formData.youtube) 
                  ? 'border-red-300' 
                  : 'border-gray-300'
              }`}
            />
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

export default SocialLinks;