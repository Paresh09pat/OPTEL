import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiImage, FiUpload } from 'react-icons/fi';

const DesignSettings = () => {
  const [designSettings, setDesignSettings] = useState({
    avatar: null,
    avatar_path: '',
    cover: null,
    cover_path: '',
    is_avatar_default: false,
    is_cover_default: false
  });
  const [designData, setDesignData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('default');

  // Fetch design settings from API
  useEffect(() => {
    const fetchDesignSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/design/settings`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setDesignData(data.design_settings);
          setDesignSettings(data.design_settings);
          
          // Set theme based on cover default status
          setSelectedTheme(data.design_settings.is_cover_default ? 'default' : 'my-background');
        } else {
          throw new Error(data.api_text || 'Failed to fetch design settings');
        }
      } catch (err) {
        console.error('Error fetching design settings:', err);
        setError('Failed to load design settings. Please try again.');
        // Set fallback data to maintain UI
        setDesignSettings({
          avatar: null,
          avatar_path: '',
          cover: null,
          cover_path: '',
          is_avatar_default: false,
          is_cover_default: false
        });
        setSelectedTheme('default');
      } finally {
        setLoading(false);
      }
    };

    fetchDesignSettings();
  }, []);

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    // Clear success message when user makes changes
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  const handleImageUpload = (type) => {
    // This would typically open a file picker
    // For now, we'll just show a placeholder
    console.log(`Upload ${type} image`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      setError(null);
      setUpdateSuccess(false);

      // Prepare API request body
      const apiData = {
        is_cover_default: selectedTheme === 'default',
        is_avatar_default: selectedTheme === 'default'
      };
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/design/settings`,
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
        setDesignData(data.design_settings);
        setDesignSettings(data.design_settings);
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.api_text || 'Failed to update design settings');
      }
    } catch (err) {
      console.error('Error updating design settings:', err);
      setError('Failed to update design settings. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">
        Design
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading design settings...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Background Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Background</h3>
              <div 
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => handleImageUpload('cover')}
              >
                {designSettings.cover_path ? (
                  <img 
                    src={designSettings.cover_path} 
                    alt="Background" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <FiImage className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Click to upload background</p>
                  </div>
                )}
              </div>
            </div>

            {/* Theme Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Theme</h3>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="default"
                    checked={selectedTheme === 'default'}
                    onChange={() => handleThemeChange('default')}
                    className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-gray-700">Default</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value="my-background"
                    checked={selectedTheme === 'my-background'}
                    onChange={() => handleThemeChange('my-background')}
                    className="w-4 h-4 text-purple-500 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 text-gray-700">My Background</span>
                </label>
              </div>
            </div>
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
          <p className="text-green-600 text-sm">Design settings updated successfully!</p>
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

export default DesignSettings;