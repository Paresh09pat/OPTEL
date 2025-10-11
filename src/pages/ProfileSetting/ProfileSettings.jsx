import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    relationship: '',
    college: '',
    university: ''
  });
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  // Get user ID from localStorage
  const userId = localStorage.getItem('user_id') || '222102'; // Default fallback

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        setUserError(null);
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
          // Populate form with user data
          setFormData({
            firstName: data.user_data.first_name || '',
            lastName: data.user_data.last_name || '',
            aboutMe: data.user_data.about || '',
            location: data.user_data.address || '',
            school: data.user_data.school || '',
            schoolCompleted: false, // This field might not be in API, keeping default
            workingAt: data.user_data.working || '',
            companyWebsite: data.user_data.working_link || '',
            website: data.user_data.website || '',
            relationship: data.user_data.relationship_id ? getRelationshipText(data.user_data.relationship_id) : 'Single',
            college: '', // This field might not be in API
            university: '' // This field might not be in API
          });
        } else {
          throw new Error(data.api_text || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserError('Failed to load user data. Please try again.');
        // Set fallback data to maintain UI
        setFormData({
          firstName: 'Aman',
          lastName: 'Shaikh',
          aboutMe: 'About me....',
          location: 'Location',
          school: 'School',
          schoolCompleted: true,
          workingAt: 'Apple',
          companyWebsite: 'Apple',
          website: 'Apple',
          relationship: 'Single',
          college: 'College Name',
          university: 'University Name'
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile Settings Data:', formData);
    // Handle form submission here
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">Profile Setting</h2>
      
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
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location :</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
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
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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

          {/* College */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">College :</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              placeholder="College Name"
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">University :</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="University Name"
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

          <div className="border-t border-[#d3d1d1] pt-4 mt-3.5 grid place-items-center ">
            <button 
              type="submit"
              className="w-32 mx-auto border border-purple-500 text-purple-500 bg-white py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
            >
              Save
            </button>
          </div> 
        </form>
      )}
      
      {userError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{userError}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
