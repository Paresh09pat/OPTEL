import React, { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiAlertTriangle } from "react-icons/fi";
import axios from "axios";
import Avatar from "../../components/Avatar";
import { toast } from "react-toastify";

const DeleteAccount = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Get user ID from localStorage
  const userId = localStorage.getItem('user_id') || '222102'; // Default fallback

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setUserData(data.user_data);
        } else {
          throw new Error(data.api_text || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleDeleteClick = () => {
    if (!password.trim()) {
      setError('Please enter your current password to proceed.');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/account/delete`,
        {
          password: password,
          confirmation: "DELETE"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
          }
        }
      );

      const data = response.data;
      
      if (data.api_status === '200') {
        toast.success('Account deletion request submitted. You will receive a confirmation email.');
        
        // Clear local storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        
        // Reset form
        setPassword("");
        setShowConfirmDialog(false);
        
        // Redirect to login page
        window.location.href = '/login';
      } else {
        toast.error(data.api_text || 'Failed to delete account');
      }
      
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err.response?.data?.api_text) {
        setError(err.response.data.api_text);
      } else if (err.response?.status === 401) {
        setError('Invalid password. Please check your password and try again.');
      } else {
        setError('Failed to delete account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-[#d3d1d1]">      
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">
          Delete Account
        </h2>

        {/* Profile Section */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#d3d1d1]">
          <Avatar
            src={userData?.avatar_url}
            name={`${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'User Name'}
            email={userData?.email}
            alt="profile photo"
            size="lg"
            className="w-16 h-16"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {userLoading ? 'Loading...' : `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'User Name'}
            </h3>
            <p className="text-gray-600">
              @{userLoading ? 'loading...' : userData?.username || 'username'}
            </p>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-800 font-medium mb-1">Warning: This action cannot be undone</h4>
              <p className="text-red-700 text-sm">
                Deleting your account will permanently remove all your data, posts, and content. 
                This action is irreversible.
              </p>
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="w-full px-4 py-3 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Footer with Delete Button */}
        <div className="border-t border-[#d3d1d1] pt-4">
          <div className="flex justify-end">
            <button
              onClick={handleDeleteClick}
              disabled={loading || !password.trim()}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${loading || !password.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
                }
              `}
            >
              {loading ? 'Processing...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertTriangle className="text-red-500 text-2xl" />
              <h3 className="text-lg font-semibold text-gray-800">Confirm Account Deletion</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
