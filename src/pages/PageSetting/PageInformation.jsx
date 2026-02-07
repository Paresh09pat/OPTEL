// components/PageInformation.js
import React from 'react';

const PageInformation = ({ formData, handleChange }) => {
  // Validate phone number (only digits, max 10)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      handleChange({ target: { name: 'phone', value } });
    }
  };

  // Validate location (max 100 characters)
  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      handleChange({ target: { name: 'location', value } });
    }
  };

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="Enter 10 digit phone number"
              maxLength={10}
              pattern="[0-9]{10}"
              required
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            />
            {formData.phone && formData.phone.length < 10 && (
              <p className="text-xs text-red-500 mt-1">Phone number must be 10 digits</p>
            )}
          </div>
        </div>

        {/* Location and Website - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleLocationChange}
              placeholder="Enter a location"
              maxLength={100}
              required
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.location?.length || 0}/100 characters
            </p>
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