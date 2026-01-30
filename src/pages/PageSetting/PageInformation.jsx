// components/PageInformation.js
import React from 'react';

const PageInformation = ({ formData, handleChange }) => {

  return (
    <div className="bg-white rounded-xl p-3.5 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">Page Information</h2>
      
      <div className="space-y-4">
        {/* Company and Phone - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder=""
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder=""
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            />
          </div>
        </div>

        {/* Location and Website - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter a location"
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder=""
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            />
            <p className="text-xs text-gray-400 mt-1">(e.g: http://www.siteurl.com)</p>
          </div>
        </div>

        {/* About - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder=""
            rows={6}
            className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default PageInformation;