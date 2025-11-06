import React, { useState } from 'react';
import axios from 'axios';

const ChangePass = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    repeatPassword: '',
    twoFactorAuth: 'Disable'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear messages when user makes changes
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.currentPassword) {
      setError('Current password is required');
      return;
    }
    
    if (!formData.newPassword) {
      setError('New password is required');
      return;
    }
    
    if (formData.newPassword !== formData.repeatPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Prepare API request body
      const requestBody = {
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        repeat_new_password: formData.repeatPassword
      };
      
      // Make API call to change password
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/password/change`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
          }
        }
      );

      const data = response.data;
      
      if (data.api_status === '200') {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          repeatPassword: '',
          twoFactorAuth: formData.twoFactorAuth
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.api_text || 'Failed to change password');
      }
      
    } catch (err) {
      console.error('Error changing password:', err);
      
      // Handle different error cases
      if (err.response?.data?.api_text) {
        setError(err.response.data.api_text);
      } else if (err.response?.status === 401) {
        setError('Current password is incorrect');
      } else if (err.response?.status === 400) {
        setError('Invalid password format or requirements not met');
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">
        Change Password
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Current Password"
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="New password"
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Repeat Password */}
          <div>
            <input
              type="password"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Two-factor authentication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Two-factor authentication
            </label>
            <select
              name="twoFactorAuth"
              value={formData.twoFactorAuth}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Disable">Disable</option>
              <option value="Enable">Enable</option>
            </select>
          </div>
        </div>

        <div className="border-t border-[#d3d1d1] pt-4 mt-3.5 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className={`px-6 py-2 border border-purple-500 text-purple-500 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                Saving...
              </div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
      
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">Password changed successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ChangePass;