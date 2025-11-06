import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBell, FiMail } from 'react-icons/fi';

const NotificationsSettings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    e_liked: false,
    e_shared: false,
    e_wondered: false,
    e_commented: false,
    e_followed: false,
    e_accepted: false,
    e_mentioned: false,
    e_joined_group: false,
    e_liked_page: false,
    e_visited: false,
    e_profile_wall_post: false
  });
  const [notificationData, setNotificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');

  // Fetch notification settings from API
  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/notifications/settings`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setNotificationData(data);
          // Map API response to form fields (0 = unchecked, 1 = checked)
          setNotificationSettings({
            e_liked: data.notification_settings.e_liked === 1,
            e_shared: data.notification_settings.e_shared === 1,
            e_wondered: data.notification_settings.e_wondered === 1,
            e_commented: data.notification_settings.e_commented === 1,
            e_followed: data.notification_settings.e_followed === 1,
            e_accepted: data.notification_settings.e_accepted === 1,
            e_mentioned: data.notification_settings.e_mentioned === 1,
            e_joined_group: data.notification_settings.e_joined_group === 1,
            e_liked_page: data.notification_settings.e_liked_page === 1,
            e_visited: data.notification_settings.e_visited === 1,
            e_profile_wall_post: data.notification_settings.e_profile_wall_post === 1
          });
        } else {
          throw new Error(data.api_text || 'Failed to fetch notification settings');
        }
      } catch (err) {
        console.error('Error fetching notification settings:', err);
        setError('Failed to load notification settings. Please try again.');
        // Set fallback data to maintain UI
        setNotificationSettings({
          e_liked: true,
          e_shared: true,
          e_wondered: false,
          e_commented: true,
          e_followed: true,
          e_accepted: true,
          e_mentioned: true,
          e_joined_group: true,
          e_liked_page: true,
          e_visited: true,
          e_profile_wall_post: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleChange = (setting, checked) => {
    setNotificationSettings({ ...notificationSettings, [setting]: checked });
    // Clear success message when user makes changes
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      setError(null);
      setUpdateSuccess(false);

      // Prepare API request body with all current values
      const apiData = {};
      Object.keys(notificationSettings).forEach(key => {
        apiData[key] = notificationSettings[key] ? 1 : 0;
      });
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/notifications/settings`,
        apiData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
          }
        }
      );

      const data = response.data;
      
      if (data.api_status === '200') {
        setUpdateSuccess(true);
        setNotificationData(data);
        
        // Update form with the response data to ensure consistency
        setNotificationSettings({
          e_liked: data.notification_settings.e_liked === 1,
          e_shared: data.notification_settings.e_shared === 1,
          e_wondered: data.notification_settings.e_wondered === 1,
          e_commented: data.notification_settings.e_commented === 1,
          e_followed: data.notification_settings.e_followed === 1,
          e_accepted: data.notification_settings.e_accepted === 1,
          e_mentioned: data.notification_settings.e_mentioned === 1,
          e_joined_group: data.notification_settings.e_joined_group === 1,
          e_liked_page: data.notification_settings.e_liked_page === 1,
          e_visited: data.notification_settings.e_visited === 1,
          e_profile_wall_post: data.notification_settings.e_profile_wall_post === 1
        });
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.api_text || 'Failed to update notification settings');
      }
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('Failed to update notification settings. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Get notification options from API response or use fallback
  const getNotificationOptions = () => {
    if (notificationData?.notification_settings_detailed) {
      // Filter out unsupported fields (like e_memory)
      const supportedFields = Object.keys(notificationData.notification_settings_detailed).filter(key => 
        notificationSettings.hasOwnProperty(key)
      );
      
      return supportedFields.map(key => ({
        key,
        label: notificationData.notification_settings_detailed[key].label
      }));
    }
    
    // Fallback labels
    return [
      { key: 'e_liked', label: 'Someone liked your post' },
      { key: 'e_shared', label: 'Someone shared your post' },
      { key: 'e_wondered', label: 'Someone reacted to your post' },
      { key: 'e_commented', label: 'Someone commented on your post' },
      { key: 'e_followed', label: 'Someone followed you' },
      { key: 'e_accepted', label: 'Someone accepted your follow request' },
      { key: 'e_mentioned', label: 'Someone mentioned you' },
      { key: 'e_joined_group', label: 'Someone joined your group' },
      { key: 'e_liked_page', label: 'Someone liked your page' },
      { key: 'e_visited', label: 'Someone visited your profile' },
      { key: 'e_profile_wall_post', label: 'Someone posted on your wall' }
    ];
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">
        Notification Settings
      </h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiBell className="w-4 h-4" />
          Notification Settings
        </button>
       
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading notification settings...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notify me when</h3>
            
            {getNotificationOptions().map((option) => (
              <div key={option.key} className="flex items-center">
                <input
                  type="checkbox"
                  id={option.key}
                  checked={notificationSettings[option.key]}
                  onChange={(e) => handleChange(option.key, e.target.checked)}
                  className="w-4 h-4 text-purple-500 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor={option.key} className="ml-3 text-sm text-gray-700 cursor-pointer">
                  {option.label}
                </label>
              </div>
            ))}
          </div>

          <div className="border-t border-[#d3d1d1] pt-4 mt-6 flex justify-end">
            <button 
              type="submit"
              disabled={updateLoading}
              className={`px-6 py-2 border border-purple-500 text-purple-500 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold ${
                updateLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
              }`}
            >
              {updateLoading ? (
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
      )}
      
      {updateSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">Notification settings updated successfully!</p>
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

export default NotificationsSettings;