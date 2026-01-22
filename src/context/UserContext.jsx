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
  const [hasActiveStories, setHasActiveStories] = useState(false); // Track if user has active stories
  const [storyUpdateTrigger, setStoryUpdateTrigger] = useState(0); // Trigger for story updates

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
    const currentUserId = localStorage.getItem('user_id');
    if (currentUserId) {
      fetchUserData();
    }
  };

  // Update user data
  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  // Notify that a story was created/deleted
  const notifyStoryUpdate = (hasStories = true) => {
    setHasActiveStories(hasStories);
    setStoryUpdateTrigger(prev => prev + 1); // Increment to trigger re-renders
  };

  // Check if user has active stories
  const checkUserStories = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/stories/user-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          limit: 20,
          offset: 0
        }),
      });

      const data = await response.json();
      if (data?.api_status === 200 && data?.stories && data.stories.length > 0) {
        const currentUserId = localStorage.getItem('user_id');
        const userStories = data.stories.find(
          (storyGroup) => storyGroup.user_id.toString() === currentUserId.toString()
        );
        setHasActiveStories(userStories && userStories.stories && userStories.stories.length > 0);
      } else {
        setHasActiveStories(false);
      }
    } catch (error) {
      console.error('Error checking user stories:', error);
      setHasActiveStories(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
      checkUserStories(); // Check stories on mount
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Listen for localStorage changes (e.g., after login)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user_id' && e.newValue) {
        fetchUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    userData,
    followers,
    following,
    loading,
    error,
    refreshUserData,
    updateUserData,
    userId,
    hasActiveStories,
    notifyStoryUpdate,
    storyUpdateTrigger,
    checkUserStories
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
