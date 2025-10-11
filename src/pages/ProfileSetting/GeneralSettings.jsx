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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

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
        setCountries(sortedCountries);
      } catch (err) {
        setError('Failed to load countries. Please try again.');
        console.error('Error fetching countries:', err);
        // Fallback to a basic list if API fails
        setCountries(['India', 'United States', 'United Kingdom', 'Canada', 'Australia']);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("General Settings Data:", formData);
    // Handle form submission here
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
                  <option key={index} value={country}>
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
              className="w-32 mx-auto border border-purple-500 text-purple-500 bg-white py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default GeneralSettings;
