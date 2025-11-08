import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { FiUser, FiCalendar, FiGlobe } from 'react-icons/fi';

const TellUsAboutYou = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useUser();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    country: '',
    birthday: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user data from signup response stored in localStorage
  React.useEffect(() => {
    const userData = localStorage.getItem('signup_user_data');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setFormData(prev => ({
          ...prev,
          first_name: parsed.first_name || '',
          last_name: parsed.last_name || '',
        }));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name || !formData.country || !formData.birthday) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      
      // Get existing user data from signup
      const signupData = localStorage.getItem('signup_user_data');
      let userDataObj = {};
      
      if (signupData) {
        try {
          userDataObj = JSON.parse(signupData);
        } catch (e) {
          console.error('Error parsing signup data:', e);
        }
      }

      // Merge form data with existing user data
      const userData = {
        ...userDataObj,
        first_name: formData.first_name,
        last_name: formData.last_name,
        country: formData.country,
        birthday: formData.birthday,
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/settings/update-user-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'general_settings',
          user_data: JSON.stringify(userData),
        })
      });

      const data = await response.json();

      if (response.ok && data.api_status === "200") {
        // Refresh user data
        refreshUserData();
        
        // Navigate to home page (user is now logged in)
        navigate('/');
      } else {
        setError(data.message || data.api_text || 'Failed to save information. Please try again.');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-[#d3d1d1] p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Tell us about you.
          </h2>
          <p className="text-sm text-gray-600 text-center mb-8">
            Share your information with our community.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                First name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d60eb] focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                Last name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d60eb] focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="relative">
                <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d60eb] focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="Brazil">Brazil</option>
                </select>
              </div>
            </div>

            {/* Birthday */}
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
                Birthday
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  required
                  value={formData.birthday}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d60eb] focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#1d60eb] text-white rounded-lg font-medium hover:bg-[#1a4fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d60eb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TellUsAboutYou;

