import React, { useState } from 'react';
import { FiEdit3, FiCalendar } from 'react-icons/fi';

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    username: '1742984839782963_44271',
    email: '45amanshaikh@gmail.com',
    mobile: '7350786629',
    birthdate: '16-11-2000',
    gender: 'Male',
    country: 'India'
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
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">General Setting</h2>
      
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#d3d1d1]">
        <div className="size-16 bg-gray-200 rounded-full flex items-center justify-center" style={{ backgroundImage: "url('/perimg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Aman Shaikh</h3>
          <p className="text-gray-600">@_amu_456</p>
        </div>
        <button className="p-2 text-gray-600 hover:text-purple-500 transition-colors">
          <FiEdit3 className="size-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username or Email id : <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile No. :</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate :</label>
            <div className="relative">
              <input
                type="text"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-3 py-2 pr-10 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender :</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country :</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>

        <div className="border-t border-[#d3d1d1] pt-4 mt-3.5 grid place-items-center ">
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

export default GeneralSettings;
