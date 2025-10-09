import React, { useState } from 'react';

const PrivacySettings = () => {
  const [privacySettings, setPrivacySettings] = useState({
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

  const handleChange = (setting, value) => {
    setPrivacySettings({ ...privacySettings, [setting]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Privacy Settings Data:', privacySettings);
    // Handle form submission here
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
      options: ['Everyone', 'Friends', 'Friends of Friends', 'No one']
    },
    {
      key: 'whoCanPostTimeline',
      label: 'Who can post on my timeline?',
      options: ['Everyone', 'Friends', 'Friends of Friends', 'No one']
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
                  className="px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm min-w-[120px]"
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
            className="w-32 mx-auto border border-orange-[#F69F58] text-[#F69F58] bg-white py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
          >
            Save
          </button>
        </div> 
      </form>
    </div>
  );
};

export default PrivacySettings;
