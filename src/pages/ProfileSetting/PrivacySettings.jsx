import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
    whoCanMessage: '',
    whoCanSeeFriends: '',
    whoCanPostTimeline: '',
    whoCanSeeBirthday: '',
    sendNotificationOnVisit: '',
    showActivities: '',
    status: '',
    shareLocationWithPublic: '',
    allowSearchEngines: ''
  });
  const [privacyData, setPrivacyData] = useState(null);
  const [privacyLoading, setPrivacyLoading] = useState(true);
  const [privacyError, setPrivacyError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch privacy settings from API
  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        setPrivacyLoading(true);
        setPrivacyError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/privacy/settings`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setPrivacyData(data.privacy_settings);
          // Map API response to form fields (handle both text and numeric values)
          setPrivacySettings({
            whoCanMessage: data.privacy_settings.message_privacy_text || getMessagePrivacyText(data.privacy_settings.message_privacy),
            whoCanSeeFriends: data.privacy_settings.follow_privacy_text || getFollowPrivacyText(data.privacy_settings.follow_privacy),
            whoCanPostTimeline: data.privacy_settings.post_privacy || 'ifollow',
            whoCanSeeBirthday: data.privacy_settings.birth_privacy_text || getBirthPrivacyText(data.privacy_settings.birth_privacy),
            sendNotificationOnVisit: data.privacy_settings.visit_privacy_text === 'Visible' ? 'Yes' : (data.privacy_settings.visit_privacy === '1' ? 'Yes' : 'No'),
            showActivities: data.privacy_settings.show_activities_privacy === '1' ? 'Yes' : 'No',
            status: data.privacy_settings.status_text || getStatusText(data.privacy_settings.status),
            shareLocationWithPublic: data.privacy_settings.share_my_location === '1' ? 'Yes' : 'No',
            allowSearchEngines: data.privacy_settings.share_my_data === '1' ? 'Yes' : 'No'
          });
        } else {
          throw new Error(data.api_text || 'Failed to fetch privacy settings');
        }
      } catch (err) {
        console.error('Error fetching privacy settings:', err);
        setPrivacyError('Failed to load privacy settings. Please try again.');
        // Set fallback data to maintain UI
        setPrivacySettings({
          whoCanMessage: 'Everyone',
          whoCanSeeFriends: 'Everyone',
          whoCanPostTimeline: 'Everyone',
          whoCanSeeBirthday: 'Everyone',
          sendNotificationOnVisit: 'Yes',
          showActivities: 'Yes',
          status: 'Online',
          shareLocationWithPublic: 'Yes',
          allowSearchEngines: 'Yes'
        });
      } finally {
        setPrivacyLoading(false);
      }
    };

    fetchPrivacySettings();
  }, []);

  const handleChange = (setting, value) => {
    setPrivacySettings({ ...privacySettings, [setting]: value });
    // Clear success message when user makes changes
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  // Helper function to convert form values to API format
  const convertToApiFormat = (formData) => {
    return {
      message_privacy: getMessagePrivacyValue(formData.whoCanMessage),
      follow_privacy: getFollowPrivacyValue(formData.whoCanSeeFriends),
      birth_privacy: getBirthPrivacyValue(formData.whoCanSeeBirthday),
      status: getStatusValue(formData.status),
      visit_privacy: getVisitPrivacyValue(formData.sendNotificationOnVisit),
      post_privacy: formData.whoCanPostTimeline,
      confirm_followers: "0", // Default value
      show_activities_privacy: formData.showActivities === 'Yes' ? "1" : "0",
      share_my_location: formData.shareLocationWithPublic === 'Yes' ? "1" : "0",
      share_my_data: formData.allowSearchEngines === 'Yes' ? "1" : "0"
    };
  };

  // Helper functions to convert form values to API numeric values
  const getMessagePrivacyValue = (value) => {
    const mapping = {
      'Everyone': '0',
      'Friends': '1',
      'Friends of Friends': '2',
      'No one': '3'
    };
    return mapping[value] || '0';
  };

  const getFollowPrivacyValue = (value) => {
    const mapping = {
      'Everyone can follow': '0',
      'Friends': '1',
      'Friends of Friends': '2',
      'No one': '3'
    };
    return mapping[value] || '0';
  };

  const getBirthPrivacyValue = (value) => {
    const mapping = {
      'Everyone': '0',
      'Friends': '1',
      'Friends of Friends': '2',
      'No one': '3'
    };
    return mapping[value] || '0';
  };

  const getStatusValue = (value) => {
    const mapping = {
      'Online': '1',
      'Offline': '0',
      'Away': '2',
      'Busy': '3'
    };
    return mapping[value] || '0';
  };

  const getVisitPrivacyValue = (value) => {
    return value === 'Yes' ? '1' : '0';
  };

  // Reverse conversion functions (numeric to text)
  const getMessagePrivacyText = (value) => {
    const mapping = {
      '0': 'Everyone',
      '1': 'Friends',
      '2': 'Friends of Friends',
      '3': 'No one'
    };
    return mapping[value] || 'Everyone';
  };

  const getFollowPrivacyText = (value) => {
    const mapping = {
      '0': 'Everyone can follow',
      '1': 'Friends',
      '2': 'Friends of Friends',
      '3': 'No one'
    };
    return mapping[value] || 'Everyone can follow';
  };

  const getBirthPrivacyText = (value) => {
    const mapping = {
      '0': 'Everyone',
      '1': 'Friends',
      '2': 'Friends of Friends',
      '3': 'No one'
    };
    return mapping[value] || 'Everyone';
  };

  const getStatusText = (value) => {
    const mapping = {
      '0': 'Offline',
      '1': 'Online',
      '2': 'Away',
      '3': 'Busy'
    };
    return mapping[value] || 'Offline';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      setPrivacyError(null);
      setUpdateSuccess(false);

      const apiData = convertToApiFormat(privacySettings);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/privacy/settings`,
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
        setPrivacyData(data.privacy_settings);
        
        // Update form with the response data to ensure consistency
        setPrivacySettings({
          whoCanMessage: getMessagePrivacyText(data.privacy_settings.message_privacy),
          whoCanSeeFriends: getFollowPrivacyText(data.privacy_settings.follow_privacy),
          whoCanPostTimeline: data.privacy_settings.post_privacy || 'ifollow',
          whoCanSeeBirthday: getBirthPrivacyText(data.privacy_settings.birth_privacy),
          sendNotificationOnVisit: data.privacy_settings.visit_privacy === '1' ? 'Yes' : 'No',
          showActivities: data.privacy_settings.show_activities_privacy === '1' ? 'Yes' : 'No',
          status: getStatusText(data.privacy_settings.status),
          shareLocationWithPublic: data.privacy_settings.share_my_location === '1' ? 'Yes' : 'No',
          allowSearchEngines: data.privacy_settings.share_my_data === '1' ? 'Yes' : 'No'
        });
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.api_text || 'Failed to update privacy settings');
      }
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      setPrivacyError('Failed to update privacy settings. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const privacyOptions = [
    {
      key: 'whoCanMessage',
      label: 'Who can message me?',
      options: ['Everyone', 'Friends', 'Friends of Friends', 'No one']
    },
    {
      key: 'whoCanSeeFriends',
      label: 'Who can see my friends?',
      options: ['Everyone can follow', 'Friends', 'Friends of Friends', 'No one']
    },
    {
      key: 'whoCanPostTimeline',
      label: 'Who can post on my timeline?',
      options: ['ifollow', 'Everyone', 'Friends', 'Friends of Friends', 'No one']
    },
    {
      key: 'whoCanSeeBirthday',
      label: 'Who can see my birthday?',
      options: ['Everyone', 'Friends', 'Friends of Friends', 'No one']
    },
    {
      key: 'sendNotificationOnVisit',
      label: 'Send users a notification when i visit their profile?',
      options: ['Yes', 'No'],
      helperText: 'if you don\'t share your visit event, you won\'t be able to see other people visiting your profile.'
    },
    {
      key: 'showActivities',
      label: 'Show my activities?',
      options: ['Yes', 'No']
    },
    {
      key: 'status',
      label: 'Status',
      options: ['Online', 'Offline', 'Away', 'Busy']
    },
    {
      key: 'shareLocationWithPublic',
      label: 'Share my location with public?',
      options: ['Yes', 'No']
    },
    {
      key: 'allowSearchEngines',
      label: 'Allow search engines to index my profile and posts?',
      options: ['Yes', 'No']
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">Privacy Setting</h2>
      
      {privacyLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading privacy settings...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {privacyOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {option.label}
                </label>
                {option.helperText && (
                  <p className="text-xs text-gray-500 mt-1">{option.helperText}</p>
                )}
              </div>
              <div className="ml-4">
                <select
                  value={privacySettings[option.key]}
                  onChange={(e) => handleChange(option.key, e.target.value)}
                  className="px-3 py-2 border border-[#d3d1d1] rounded-3xl text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {option.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

          <div className="border-t border-[#d3d1d1] pt-4 mt-3.5 grid place-items-center ">
            <button 
              type="submit"
              disabled={updateLoading}
              className={`w-32 mx-auto border border-purple-500 text-purple-500 bg-white py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold ${
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
          <p className="text-green-600 text-sm">Privacy settings updated successfully!</p>
        </div>
      )}
      
      {privacyError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{privacyError}</p>
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
