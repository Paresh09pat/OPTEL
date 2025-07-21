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
    <div className="bg-white rounded-xl p-3.5 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">General Setting</h2>
      
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
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category :</label>
            <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
>
  {/* Show "Select Category" only if nothing is selected */}
  {!formData.category && (
    <option value="" disabled hidden>
      Select Category
    </option>
  )}
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
  className="w-full px-3 py-2 border border-[#212121]  rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
>
  {/* Show placeholder only if nothing is selected */}
  {!formData.subCategory && (
    <option value="" disabled hidden>
      Select Sub-Category
    </option>
  )}
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
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page url :</label>
            <input
              type="url"
              name="pageUrl"
              placeholder="https://optel.com/"
              value={formData.pageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#8bc34a" d="M9 3L8 6H4l1 4l-3 2l3 2l-1 4h4l1 3l3-2l3 2l1-3h4l-1-4l3-2l-3-2l1-4h-4l-1-3l-3 2zm7 5l1 1l-7 7l-3-3l1-1l2 2z"></path></svg>
              Verified
            </span>
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

export default GeneralSettings;