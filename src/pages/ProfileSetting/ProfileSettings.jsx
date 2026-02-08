import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    aboutMe: '',
    location: '',
    school: '',
    schoolCompleted: false,
    workingAt: '',
    companyWebsite: '',
    website: '',
    relationship: ''
  });
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

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
          
          // Get location from localStorage if available, otherwise use API data
          const savedAddress = localStorage.getItem('user_address');
          const locationToUse = savedAddress || data.user_data.address || '';
          
          // Populate form with user data
          setFormData({
            firstName: data.user_data.first_name || '',
            lastName: data.user_data.last_name || '',
            aboutMe: data.user_data.about || '',
            location: locationToUse,
            school: data.user_data.school || '',
            schoolCompleted: false, // This field might not be in API, keeping default
            workingAt: data.user_data.working || '',
            companyWebsite: data.user_data.working_link || '',
            website: data.user_data.website || '',
            relationship: data.user_data.relationship_id !== undefined ? getRelationshipText(data.user_data.relationship_id) : 'Single'
          });
        } else {
          throw new Error(data.api_text || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast.error('Failed to load user data. Please try again.');
        
        // Get location from localStorage for fallback
        const savedAddress = localStorage.getItem('user_address');
        
        // Set fallback data to maintain UI
        setFormData({
          firstName: '',
          lastName: '',
          aboutMe: 'About me....',
          location: savedAddress || 'Location',
          school: 'School',
          schoolCompleted: true,
          workingAt: '',
          companyWebsite: '',
          website: '',
          relationship: 'Single'
        });
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Helper function to convert relationship_id to text
  const getRelationshipText = (relationshipId) => {
    const relationships = {
      0: 'Single',
      1: 'In a relationship',
      2: 'Married',
      3: 'Divorced',
      4: 'Widowed'
    };
    return relationships[relationshipId] || 'Single';
  };

  // Function to get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Ouptel-App'
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else if (data && data.address) {
        const addr = data.address;
        const parts = [
          addr.road || addr.street,
          addr.city || addr.town || addr.village,
          addr.state,
          addr.country
        ].filter(Boolean);
        return parts.join(', ');
      }
      
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  // Function to detect user's current location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        // Store coordinates in localStorage
        localStorage.setItem('user_location', JSON.stringify(location));
        
        // Get address from coordinates
        const address = await getAddressFromCoordinates(location.latitude, location.longitude);
        
        if (address) {
          // Store address in localStorage
          localStorage.setItem('user_address', address);
          
          // Update form data
          setFormData(prev => ({
            ...prev,
            location: address
          }));
          
          toast.success('Location detected successfully!');
        } else {
          toast.error('Could not convert location to address. Please enter manually.');
        }
        
        setDetectingLocation(false);
      },
      (error) => {
        setDetectingLocation(false);
        
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Location access denied. Please enable location permissions in your browser settings.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          toast.error('Location information is unavailable.');
        } else if (error.code === error.TIMEOUT) {
          toast.error('Location request timed out.');
        } else {
          toast.error('Unable to retrieve your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setUpdateLoading(true);
    
    try {
      // Convert relationship text back to ID
      const getRelationshipId = (relationshipText) => {
        const relationships = {
          'Single': 0,
          'In a relationship': 1,
          'Married': 2,
          'Divorced': 3,
          'Widowed': 4
        };
        return relationships[relationshipText] || 0;
      };

      // Prepare user data for API - only include changed fields
      const userDataToUpdate = {};
      
      // Compare current form data with original user data to find changes
      if (formData.firstName !== (userData?.first_name || '')) {
        userDataToUpdate.first_name = formData.firstName;
      }
      if (formData.lastName !== (userData?.last_name || '')) {
        userDataToUpdate.last_name = formData.lastName;
      }
      if (formData.aboutMe !== (userData?.about || '')) {
        userDataToUpdate.about = formData.aboutMe;
      }
      if (formData.location !== (userData?.address || '')) {
        userDataToUpdate.address = formData.location;
      }
      if (formData.school !== (userData?.school || '')) {
        userDataToUpdate.school = formData.school;
      }
      if (formData.workingAt !== (userData?.working || '')) {
        userDataToUpdate.working = formData.workingAt;
      }
      if (formData.companyWebsite !== (userData?.working_link || '')) {
        userDataToUpdate.working_link = formData.companyWebsite;
      }
      if (formData.website !== (userData?.website || '')) {
        userDataToUpdate.website = formData.website;
      }
      const currentRelationshipId = userData?.relationship_id !== undefined ? getRelationshipText(userData.relationship_id) : 'Single';
      if (formData.relationship !== currentRelationshipId) {
        userDataToUpdate.relationship_id = getRelationshipId(formData.relationship);
      }

      // Only send request if there are changes
      if (Object.keys(userDataToUpdate).length === 0) {
        toast.info('No changes to save');
        setUpdateLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/settings/update-user-data`,
        {
          type: "general_settings",
          user_data: JSON.stringify(userDataToUpdate)
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
        toast.success("Profile updated successfully!");
        
        // Refetch user data to show updated information
        try {
          const refreshResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
              }
            }
          );

          const refreshData = refreshResponse.data;
          
          if (refreshData.api_status === '200') {
            setUserData(refreshData.user_data);
            
            // Update localStorage with new data
            if (refreshData.user_data.first_name) {
              localStorage.setItem('user_first_name', refreshData.user_data.first_name);
            }
            if (refreshData.user_data.last_name) {
              localStorage.setItem('user_last_name', refreshData.user_data.last_name);
            }
            if (refreshData.user_data.avatar_url) {
              localStorage.setItem('user_avatar_url', refreshData.user_data.avatar_url);
            }
            
            // Get location from localStorage if available, otherwise use API data
            const savedAddress = localStorage.getItem('user_address');
            const locationToUse = savedAddress || refreshData.user_data.address || '';
            
            // Update form with refreshed data
            setFormData({
              firstName: refreshData.user_data.first_name || '',
              lastName: refreshData.user_data.last_name || '',
              aboutMe: refreshData.user_data.about || '',
              location: locationToUse,
              school: refreshData.user_data.school || '',
              schoolCompleted: false,
              workingAt: refreshData.user_data.working || '',
              companyWebsite: refreshData.user_data.working_link || '',
              website: refreshData.user_data.website || '',
              relationship: refreshData.user_data.relationship_id !== undefined ? getRelationshipText(refreshData.user_data.relationship_id) : 'Single'
            });
          }
        } catch (refreshErr) {
          console.error('Error refreshing user data:', refreshErr);
          // Don't show error to user, the update was successful
        }
      } else {
        throw new Error(data.api_text || 'Failed to update profile');
      }
      
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.api_text || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-b from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">Profile Setting</h2>
      
      {userLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* First Name / Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name :</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name :</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* About me */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">About me :</label>
            <textarea
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location :
              {localStorage.getItem('user_address') && (
                <span className="ml-2 text-xs text-green-600 font-normal">
                  (Auto-detected from browser)
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="flex-1 px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className={`px-4 py-2 bg-blue-500 text-white rounded-3xl text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap ${
                  detectingLocation ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 cursor-pointer'
                }`}
              >
                {detectingLocation ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Detecting...</span>
                  </div>
                ) : (
                  '📍 Detect'
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Click "Detect" to automatically get your current location, or enter it manually.
            </p>
          </div>

          {/* School */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School :</label>
            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              placeholder="School"
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="schoolCompleted"
                  checked={formData.schoolCompleted}
                  onChange={handleChange}
                  className="mr-2 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Completed</span>
              </label>
            </div>
          </div>

          {/* Working at / Company Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working at :</label>
              <input
                type="text"
                name="workingAt"
                value={formData.workingAt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Website :</label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Website / Relationship */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website :</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship :</label>
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Single">Single</option>
                <option value="In a relationship">In a relationship</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>

          <div className="border-t border-[#d3d1d1] pt-4 mt-3.5 grid place-items-center">
            <button 
              type="submit"
              disabled={updateLoading}
              className={`px-8 py-3 bg-gradient-to-r from-[#60a1f9] to-[#1153e7] text-white rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#1153e7] focus:ring-offset-2 text-base shadow-md flex items-center gap-2 ${
                updateLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:scale-105 cursor-pointer'
              }`}
            >
              {updateLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div> 
        </form>
      )}
    </div>
  );
};

export default ProfileSettings;
