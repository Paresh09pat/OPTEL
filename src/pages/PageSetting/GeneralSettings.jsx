// components/GeneralSettings.js
import React, { useState } from 'react';

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    pageName: '',
    category: '',
    subCategory: '',
    callToAction: '',
    callToTargetUrl: '',
    pageUrl: '',
    canPost: 'disable'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('General Settings Data:', formData);
    // Handle form submission here
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">General Setting</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Name : <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pageName"
              value={formData.pageName}
              onChange={handleChange}
              placeholder="Page Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category :</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Select Category">Select Category</option>
              <option value="HIP-HOP Music">HIP-HOP Music</option>
              <option value="Rock Music">Rock Music</option>
              <option value="Pop Music">Pop Music</option>
              <option value="Jazz Music">Jazz Music</option>
              <option value="Classical Music">Classical Music</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category :</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Select Sub-Category">Select Sub-Category</option>
              <option value="HIP-HOP Music">HIP-HOP Music</option>
              <option value="Rap">Rap</option>
              <option value="Trap">Trap</option>
              <option value="Old School">Old School</option>
              <option value="Underground">Underground</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Call to action :</label>
            <input
              type="text"
              name="callToAction"
              value={formData.callToAction}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Call to target url :</label>
            <input
              type="url"
              name="callToTargetUrl"
              value={formData.callToTargetUrl}
              onChange={handleChange}
              placeholder="Url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page url :</label>
            <input
              type="url"
              name="pageUrl"
              value={formData.pageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Users can post on my page :</label>
            <div className="flex space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="canPost"
                  value="enable"
                  checked={formData.canPost === 'enable'}
                  onChange={handleChange}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Enable</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="canPost"
                  value="disable"
                  checked={formData.canPost === 'disable'}
                  onChange={handleChange}
                  className="mr-2 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">Disable</span>
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <span className="text-sm text-gray-700">Verification :</span>
            <span className="text-green-500 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
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

export default GeneralSettings;