import React, { useState } from 'react';

const DeletePage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    finalConfirmation: 'disagree'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl p-3.5 px-9 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">Delete Page</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password :</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-3 py-2 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Final confirmation to delete page</label>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="finalConfirmation"
                value="agree"
                checked={formData.finalConfirmation === 'agree'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Agree</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="finalConfirmation"
                value="disagree"
                checked={formData.finalConfirmation === 'disagree'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Disagree</span>
            </label>
          </div>
        </div>
      </div>

      <div className="border-t border-[#808080] pt-4 mt-3.5 grid place-items-center ">
        <button className="w-32 mx-auto border border-[#FF0707] text-[#FF0707] bg-white py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold">
          Delete Page
        </button>
      </div>
    </div>
  );
};

export default DeletePage;