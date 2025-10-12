import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from localStorage
  const userId = localStorage.getItem('user_id') // Default fallback

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
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
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
      } else {
        throw new Error(data.api_text || 'Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUserData = () => {
    fetchUserData();
  };

  // Update user data
  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const value = {
    userData,
    followers,
    following,
    loading,
    error,
    refreshUserData,
    updateUserData,
    userId
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
