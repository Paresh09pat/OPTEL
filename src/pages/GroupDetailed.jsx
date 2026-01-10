import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/loading/Loader';
import { baseUrl } from '../utils/constant';
import { HiUsers } from 'react-icons/hi';
import axios from 'axios';
import { toast } from 'react-toastify';

const GroupDetailed = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const accessToken = localStorage.getItem('access_token');

  const getGroup = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/groups/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      const responseData = await response.json();
      console.log(responseData, 'group-detailed');
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch group');
      }
      setGroup(responseData.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleJoinGroupClick = () => {
    if (group.is_joined) {
      // Show confirmation modal for leaving
      setShowLeaveModal(true);
    } else {
      // Join directly without modal
      handleJoinGroup();
    }
  };

  const handleJoinGroup = async () => {
    if (!group || joining) return;

    setJoining(true);
    setShowLeaveModal(false); // Close modal if open
    
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/groups/join`,
        {
          group_id: parseInt(groupId)
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = response.data;
      
      if (responseData.ok || responseData.api_status === 200) {
        const isLeaving = group.is_joined;
        
        // Update group state to reflect membership
        setGroup(prev => ({
          ...prev,
          is_joined: !prev.is_joined,
          members_count: prev.is_joined 
            ? Math.max(0, (prev.members_count || 0) - 1)
            : (prev.members_count || 0) + 1
        }));
        
        toast.success(
          isLeaving 
            ? 'Left group successfully' 
            : 'Joined group successfully'
        );
        navigate("/my-groups");
      } else {
        toast.error(responseData.message || 'Failed to join/leave group');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to join/leave group';
      toast.error(errorMessage);
    } finally {
      setJoining(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      getGroup();
    }
  }, [groupId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => navigate('/my-groups')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Group not found</p>
          <button
            onClick={() => navigate('/my-groups')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Groups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      {/* Header */}
      <div className="w-full sticky top-0 z-10 bg-[#EDF6F9] pt-8 pb-4 px-4 md:px-7">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/my-groups')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Groups</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Cover Image */}
        <div className="w-full h-64 md:h-80 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl overflow-hidden mb-6 shadow-lg">
          {group.cover_url ? (
            <img
              src={group.cover_url}
              alt={group.group_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-6xl">👥</span>
            </div>
          )}
        </div>

        {/* Group Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Group Avatar */}
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
              {group.avatar_url ? (
                <img
                  src={group.avatar_url}
                  alt={group.group_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">👥</span>
              )}
            </div>

            {/* Group Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {group.group_name || 'Unnamed Group'}
              </h1>
              {group.group_title && (
                <p className="text-lg text-gray-600 mb-3">
                  {group.group_title}
                </p>
              )}
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-gray-700">
                  <HiUsers className="w-5 h-5 text-[#3D8CFA]" />
                  <span className="font-semibold">
                    {group.members_count || 0} Members
                  </span>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      group.privacy === 'public'
                        ? 'bg-green-100 text-green-800'
                        : group.privacy === 'private'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {group.privacy
                      ? group.privacy.charAt(0).toUpperCase() +
                        group.privacy.slice(1)
                      : 'Unknown'}{' '}
                    Group
                  </span>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      group.join_privacy === 'public'
                        ? 'bg-green-100 text-green-800'
                        : group.join_privacy === 'private'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {group.join_privacy
                      ? group.join_privacy.charAt(0).toUpperCase() +
                        group.join_privacy.slice(1)
                      : 'Unknown'}{' '}
                    Join
                  </span>
                </div>
              </div>
            </div>

            {/* Join/Leave Button */}
            {!group.is_owner && (
              <div className="w-full md:w-auto">
                <button
                  onClick={handleJoinGroupClick}
                  disabled={joining}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl ${
                    group.is_joined
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  } ${joining ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {joining ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {group.is_joined ? 'Leaving...' : 'Joining...'}
                    </span>
                  ) : group.is_joined ? (
                    'Leave'
                  ) : (
                    'Join Group'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* About Section */}
        {group.about && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {group.about.replace(/<br\s*\/?>/gi, '\n')}
            </p>
          </div>
        )}

        {/* Owner Section */}
        {group.owner && group.owner.username && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Owner</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img
                  src={
                    group.owner.avatar_url ||
                    'https://66.116.199.195/images/placeholders/user-avatar.svg'
                  }
                  alt={group.owner.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  @{group.owner.username}
                </p>
                {group.owner.name && (
                  <p className="text-gray-600">{group.owner.name}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leave Group Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-fade-in">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Leave Group?
              </h3>
              <p className="text-gray-600">
                Do you really want to leave <span className="font-semibold">{group.group_name}</span>? You can always rejoin later.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                disabled={joining}
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinGroup}
                disabled={joining}
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joining ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Leaving...
                  </span>
                ) : (
                  'Leave Group'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetailed;

