import React, { useState, useEffect } from "react";
import { FiEdit3, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Avatar from "../../components/Avatar";

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    birthdate: "",
    gender: "",
    country: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [countries, setCountries] = useState([]);
  const [countryIdToName, setCountryIdToName] = useState({});
  const [nameToCountryId, setNameToCountryId] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

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
          // Populate form with user data
          setFormData({
            username: data.user_data.username || "",
            email: data.user_data.email || "",
            mobile: data.user_data.phone_number || "",
            birthdate: data.user_data.birthday || "",
            gender: data.user_data.gender || "",
            country: data.user_data.country_id || "",
          });
          
          // Set selected date if birthday exists
          if (data.user_data.birthday) {
            const birthDate = new Date(data.user_data.birthday);
            setSelectedDate(birthDate);
          }
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

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        // Sort countries alphabetically by name
        const sortedCountries = data
          .map(country => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        
        // Create mapping objects for country ID to name and name to ID
        const idToName = {};
        const nameToId = {};
        
        sortedCountries.forEach((countryName, index) => {
          const countryId = index + 1; // Start from 1
          idToName[countryId] = countryName;
          nameToId[countryName] = countryId;
        });
        
        setCountries(sortedCountries);
        setCountryIdToName(idToName);
        setNameToCountryId(nameToId);
      } catch (err) {
        setError('Failed to load countries. Please try again.');
        console.error('Error fetching countries:', err);
        // Fallback to a basic list if API fails
        const fallbackCountries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
        const idToName = {};
        const nameToId = {};
        
        fallbackCountries.forEach((countryName, index) => {
          const countryId = index + 1;
          idToName[countryId] = countryName;
          nameToId[countryName] = countryId;
        });
        
        setCountries(fallbackCountries);
        setCountryIdToName(idToName);
        setNameToCountryId(nameToId);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      // Prepare user data for API - only include changed fields
      const userDataToUpdate = {};
      
      // Compare current form data with original user data to find changes
      if (formData.username !== (userData?.username || '')) {
        userDataToUpdate.username = formData.username;
      }
      if (formData.email !== (userData?.email || '')) {
        userDataToUpdate.email = formData.email;
      }
      if (formData.mobile !== (userData?.phone_number || '')) {
        userDataToUpdate.phone_number = formData.mobile;
      }
      if (formData.birthdate !== (userData?.birthday || '')) {
        userDataToUpdate.birthday = formData.birthdate;
      }
      if (formData.gender !== (userData?.gender || '')) {
        userDataToUpdate.gender = formData.gender;
      }
      // Convert both values to numbers for proper comparison
      const currentCountryId = parseInt(userData?.country_id) || 0;
      const formCountryId = parseInt(formData.country) || 0;
      
      // Debug: Log country comparison
      console.log('Country Debug:', {
        userDataCountryId: userData?.country_id,
        formDataCountry: formData.country,
        currentCountryId,
        formCountryId,
        isDifferent: formCountryId !== currentCountryId
      });
      
      if (formCountryId !== currentCountryId && formCountryId > 0) {
        userDataToUpdate.country_id = formCountryId;
      }

      // Debug: Log what we're sending
      console.log('User Data to Update:', userDataToUpdate);
      console.log('JSON String:', JSON.stringify(userDataToUpdate));

      // Only send request if there are changes
      if (Object.keys(userDataToUpdate).length === 0) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
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
        setUpdateSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.api_text || 'Failed to update general settings');
      }
      
    } catch (err) {
      console.error('Error updating general settings:', err);
      if (err.response?.data?.api_text) {
        setUpdateError(err.response.data.api_text);
      } else {
        setUpdateError('Failed to update general settings. Please try again.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY format
      setFormData({ ...formData, birthdate: formattedDate });
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">
        General Setting
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
        <button className="p-2 text-gray-600 hover:text-purple-500 transition-colors">
          <FiEdit3 className="size-5" />
        </button>
      </div>

      {userLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email id : <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Username or Email id"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email :
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your Email"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile No. :
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                placeholder="Enter Mobile No."
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birthdate :
              </label>
              <div className="relative">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select your Birthdate"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  className="w-full px-3 py-2 pr-10 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  customInput={
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.birthdate}
                        placeholder="Select your Birthdate"
                        readOnly
                        className="w-full px-3 py-2 pr-10 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      />
                      <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5 pointer-events-none" />
                    </div>
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender :
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl ${
                  formData.gender === "" ? "text-gray-400" : "text-black"
                }`}
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country :
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl ${
                  loading ? 'bg-gray-100 cursor-not-allowed' : ''
                } ${formData.country === "" ? "text-gray-400" : "text-black"}`}
              >
                <option value="" disabled>
                  {loading ? 'Loading countries...' : 'Select your Country'}
                </option>
                {countries.map((country, index) => (
                  <option key={index} value={nameToCountryId[country]}>
                    {country}
                  </option>
                ))}
              </select>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
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
          <p className="text-green-600 text-sm">General settings updated successfully!</p>
        </div>
      )}
      
      {updateError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{updateError}</p>
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

export default GeneralSettings;
