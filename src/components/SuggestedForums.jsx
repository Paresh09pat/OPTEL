import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaComments, FaLock, FaLockOpen } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils/constant';
import Loader from './loading/Loader';
import Avatar from './Avatar';

const SuggestedForums = () => {
  const navigate = useNavigate();
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch suggested forums
  const fetchSuggestedForums = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      
      const response = await axios.get(
        `${baseUrl}/api/v1/forums`,
        {
          params: {
            type: 'suggested',
            per_page: 12,
            page: pageNum
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      const data = response.data;
      if (data?.data && Array.isArray(data.data)) {
        if (pageNum === 1) {
          setForums(data.data);
        } else {
          setForums(prev => [...prev, ...data.data]);
        }
        setPagination(data.meta || null);
      } else {
        setForums([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching suggested forums:', error);
      toast.error(error?.response?.data?.message || 'Failed to load suggested forums');
      setForums([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load suggested forums on mount
  useEffect(() => {
    fetchSuggestedForums(1);
  }, [fetchSuggestedForums]);

  // Handle join/leave forum
  const handleJoinForum = async (forumId, isJoined) => {
    try {
      const accessToken = localStorage.getItem("access_token");
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
        setForums(prev => prev.map(forum => 
          forum.id === forumId 
            ? { 
                ...forum, 
                is_joined: !isJoined,
                members_count: isJoined 
                  ? Math.max(0, (forum.members_count || 0) - 1)
                  : (forum.members_count || 0) + 1
              }
            : forum
        ));
        toast.success(isJoined ? 'Left forum successfully' : 'Joined forum successfully');
      } else {
        toast.error(data?.message || 'Failed to update forum membership');
      }
    } catch (error) {
      console.error('Error joining/leaving forum:', error);
      toast.error(error?.response?.data?.message || 'Failed to update forum membership');
    }
  };

  // Load more forums
  const loadMoreForums = () => {
    if (pagination && pagination.current_page < pagination.last_page && !loading) {
      const nextPage = pagination.current_page + 1;
      setPage(nextPage);
      fetchSuggestedForums(nextPage);
    }
  };

  if (loading && forums.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  if (forums.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No suggested forums available</p>
        <p className="text-gray-400 text-sm mt-2">Check back later for new forum suggestions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#808080] p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Suggested Forums</h2>
        <p className="text-gray-600 text-sm mt-2">
          Discover forums that might interest you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {forums.map((forum) => (
          <div
            key={forum.id}
            onClick={() => navigate(`/forum/${forum.id}`)}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-pointer"
          >
            {/* Forum Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{forum.name}</h3>
                {forum.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {forum.description}
                  </p>
                )}
              </div>
              {forum.privacy === 'private' && (
                <FaLock className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              )}
              {forum.privacy === 'public' && (
                <FaLockOpen className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </div>

            {/* Forum Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FaComments className="w-4 h-4" />
                <span>{forum.topics_count || 0} Topics</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUsers className="w-4 h-4" />
                <span>{forum.members_count || 0} Members</span>
              </div>
            </div>

            {/* Forum Owner */}
            {forum.owner && (
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <Avatar
                  src={forum.owner.avatar_url}
                  name={forum.owner.username || 'Unknown'}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Created by</p>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {forum.owner.username || 'Unknown'}
                  </p>
                </div>
              </div>
            )}

            {/* Join/Leave Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleJoinForum(forum.id, forum.is_joined);
              }}
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                forum.is_joined
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </span>
              ) : forum.is_joined ? (
                'Leave Forum'
              ) : (
                'Join Forum'
              )}
            </button>

            {/* Privacy Badge */}
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${
                forum.privacy === 'public'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {forum.privacy === 'public' ? 'Public' : 'Private'}
              </span>
              {forum.join_privacy && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  forum.join_privacy === 'public'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {forum.join_privacy === 'public' ? 'Open Join' : 'Request Join'}
                </span>
              )}
            </div>

            {/* Created Date */}
            {forum.created_at && (
              <div className="mt-2">
                <p className="text-xs text-gray-500">
                  Created: {new Date(forum.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {pagination && pagination.current_page < pagination.last_page && (
        <div className="text-center mt-8">
          <button
            onClick={loadMoreForums}
            disabled={loading}
            className="px-6 py-3 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </span>
            ) : (
              `+ Load more forums (${pagination.total - forums.length} remaining)`
            )}
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Showing {forums.length} of {pagination.total} suggested forums
        </div>
      )}
    </div>
  );
};

export default SuggestedForums;

