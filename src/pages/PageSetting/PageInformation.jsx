// components/PageInformation.js
import React, { useState } from 'react';

const PageInformation = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    location: '',
    websiteUrl: '',
    about: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Page Information Data:', formData);
    // Handle form submission here
  };

  return (
    <div className="bg-white rounded-xl p-3.5 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">Page Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name : <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone :</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location :</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="Miami">Miami</option>
              <option value="Atlanta">Atlanta</option>
              <option value="Nashville">Nashville</option>
              <option value="Las Vegas">Las Vegas</option>
              <option value="San Francisco">San Francisco</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website url :</label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="URL"
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Write Your Msg"
              rows={6}
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            />
          </div>
        </div>

        <div className="border-t border-[#808080] pt-4 mt-3.5 grid place-items-center ">
          <button 
            type="submit"
            className="w-32 mx-auto border border-orange-[#F69F58] text-[#F69F58] bg-white py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageInformation;