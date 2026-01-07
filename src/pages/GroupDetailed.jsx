import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/loading/Loader';
import { baseUrl } from '../utils/constant';
import { HiUsers } from 'react-icons/hi';

const GroupDetailed = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    </div>
  );
};

export default GroupDetailed;

