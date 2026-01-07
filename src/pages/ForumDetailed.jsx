import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUsers, FaComments, FaLock, FaLockOpen } from 'react-icons/fa';
import { baseUrl } from '../utils/constant';
import Loader from '../components/loading/Loader';
import Avatar from '../components/Avatar';
import { toast } from 'react-toastify';
import axios from 'axios';

const ForumDetailed = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const accessToken = localStorage.getItem('access_token');

  const getForum = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/forums/${forumId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      const responseData = await response.json();
      console.log(responseData, 'forum-detailed');
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to fetch forum');
      }
      
      if (responseData.ok && responseData.data) {
        const forumData = {
          ...responseData.data.forum,
          is_joined: responseData.data.forum.is_joined || false
        };
        setForum(forumData);
        setTopics(responseData.data.topics || []);
        setPagination(responseData.data.meta || null);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (forumId) {
      getForum();
    }
  }, [forumId]);

  // Handle join/leave forum
  const handleJoinForum = async (isJoined) => {
    try {
      const endpoint = isJoined 
        ? `${baseUrl}/api/v1/forums/${forumId}/leave`
        : `${baseUrl}/api/v1/forums/${forumId}/join`;
      
      const method = isJoined ? 'delete' : 'post';
      
      const response = await axios[method](
        endpoint,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      const data = response.data;
      if (data?.ok === true || data?.api_status === 200) {
        // Update forum join status
        setForum(prev => ({
          ...prev,
          is_joined: !isJoined,
          members_count: isJoined 
            ? Math.max(0, (prev.members_count || 0) - 1)
            : (prev.members_count || 0) + 1
        }));
        toast.success(isJoined ? 'Left forum successfully' : 'Joined forum successfully');
      } else {
        toast.error(data?.message || 'Failed to update forum membership');
      }
    } catch (error) {
      console.error('Error joining/leaving forum:', error);
      toast.error(error?.response?.data?.message || 'Failed to update forum membership');
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => navigate('/forum')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Forums
          </button>
        </div>
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Forum not found</p>
          <button
            onClick={() => navigate('/forum')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Forums
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
            onClick={() => navigate('/forum')}
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
            <span className="font-medium">Back to Forums</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Forum Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{forum.name}</h1>
                {forum.privacy === 'private' && (
                  <FaLock className="w-6 h-6 text-gray-400" />
                )}
                {forum.privacy === 'public' && (
                  <FaLockOpen className="w-6 h-6 text-gray-400" />
                )}
              </div>
              {forum.description && (
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {forum.description}
                </p>
              )}
            </div>
          </div>

          {/* Forum Stats and Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaComments className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Topics</p>
                <p className="text-xl font-bold text-gray-900">{forum.topics_count || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaUsers className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="text-xl font-bold text-gray-900">{forum.members_count || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-blue-600 text-xl">🔒</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Join Privacy</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {forum.join_privacy || 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              forum.privacy === 'public'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {forum.privacy === 'public' ? 'Public Forum' : 'Private Forum'}
            </span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              forum.join_privacy === 'public'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {forum.join_privacy === 'public' ? 'Open Join' : 'Request to Join'}
            </span>
            {forum.category && (
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                {forum.category}
              </span>
            )}
          </div>

          {/* Owner Section */}
          {forum.owner && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
              <Avatar
                src={forum.owner.avatar_url}
                name={forum.owner.username || 'Unknown'}
                size="md"
              />
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="text-lg font-semibold text-gray-900">
                  {forum.owner.username || 'Unknown'}
                </p>
              </div>
            </div>
          )}

          {/* Join/Leave Button */}
          <button
            onClick={() => handleJoinForum(forum.is_joined)}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              forum.is_joined
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {forum.is_joined ? 'Leave Forum' : 'Join Forum'}
          </button>

          {/* Created Date */}
          {forum.created_at && (
            <div className="mt-4 text-sm text-gray-500">
              Created: {new Date(forum.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>

        {/* Topics Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Topics</h2>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Topic
            </button>
          </div>

          {topicsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-12">
              <FaComments className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No topics yet</p>
              <p className="text-gray-400 text-sm">Be the first to start a discussion!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                  {topic.description && (
                    <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {topic.author?.username || 'Unknown'}</span>
                    {topic.created_at && (
                      <span>{new Date(topic.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Topics */}
          {pagination && pagination.current_page < pagination.last_page && (
            <div className="text-center mt-6">
              <button
                className="px-6 py-3 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                Load More Topics
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDetailed;

