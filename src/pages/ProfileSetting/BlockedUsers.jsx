import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUserX, FiUnlock } from 'react-icons/fi';
import Avatar from '../../components/Avatar';

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unblockLoading, setUnblockLoading] = useState({});
  const [success, setSuccess] = useState(false);

  // Fetch blocked users from API
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/blocked-users`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setBlockedUsers(data.data || []);
        } else {
          throw new Error(data.api_text || 'Failed to fetch blocked users');
        }
      } catch (err) {
        console.error('Error fetching blocked users:', err);
        setError('Failed to load blocked users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleUnblock = async (userId) => {
    try {
      setUnblockLoading(prev => ({ ...prev, [userId]: true }));
      setError(null);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/blocked-users/unblock`,
        { user_id: userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
          }
        }
      );

      const data = response.data;
      
      if (data.api_status === '200') {
        // Remove the unblocked user from the list
        setBlockedUsers(blockedUsers.filter(user => user.user_id !== userId));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(data.api_text || 'Failed to unblock user');
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
      setError('Failed to unblock user. Please try again.');
    } finally {
      setUnblockLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">
        Blocked Users
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blocked users...</p>
          </div>
        </div>
      ) : blockedUsers.length > 0 ? (
        <div className="space-y-4">
          {blockedUsers.map((user) => (
            <div key={user.user_id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4 flex-1">
                {/* User Avatar */}
                <Avatar
                  src={user.avatar_url}
                  name={`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Blocked User'}
                  email={user.email}
                  alt="blocked user"
                  size="md"
                  className="w-12 h-12"
                />
                
                {/* User Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Blocked User'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    @{user.username || 'unknown'}
                  </p>
                  {user.email && (
                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Unblock Button */}
              <button
                onClick={() => handleUnblock(user.user_id)}
                disabled={unblockLoading[user.user_id]}
                className={`flex items-center gap-2 px-4 py-2 border border-purple-500 text-purple-500 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold ${
                  unblockLoading[user.user_id] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
                }`}
              >
                {unblockLoading[user.user_id] ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                ) : (
                  <FiUnlock className="w-4 h-4" />
                )}
                {unblockLoading[user.user_id] ? 'Unblocking...' : 'Unblock'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FiUserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No members to show</p>
          <p className="text-gray-400 text-sm mt-2">You haven't blocked any users yet</p>
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">User unblocked successfully!</p>
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

export default BlockedUsers;