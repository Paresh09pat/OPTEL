import { useState, useEffect } from 'react';
import { FaTimes, FaUserFriends } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

const FriendRequests = ({ isOpen, onClose, onRequestHandled }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalRequests, setTotalRequests] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchFriendRequests();
    }
  }, [isOpen, currentPage]);

  const fetchFriendRequests = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `https://admin.ouptel.in/api/v1/friends/requests?per_page=12&page=${currentPage}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ok) {
        setRequests(response.data.data || []);
        setTotalRequests(response.data.meta?.total || 0);
        setHasMore(response.data.meta?.has_more || false);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      toast.error('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (userId, requestId) => {
    setActionLoading(prev => ({ ...prev, [`accept_${requestId}`]: true }));
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/friends/requests/${requestId}/accept`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ok || response.data.api_status === 200) {
        toast.success(response.data.message || 'Friend request accepted!');
        // Refetch the friend requests list
        await fetchFriendRequests();
        // Notify parent component to refresh count
        if (onRequestHandled) {
          onRequestHandled();
        }
      } else {
        toast.error(response.data.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept friend request');
    } finally {
      setActionLoading(prev => ({ ...prev, [`accept_${requestId}`]: false }));
    }
  };

  const handleDeclineRequest = async (userId, requestId) => {
    setActionLoading(prev => ({ ...prev, [`decline_${requestId}`]: true }));
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/friends/requests/${requestId}/decline`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.ok || response.data.api_status === 200) {
        toast.success(response.data.message || 'Friend request declined');
        // Refetch the friend requests list
        await fetchFriendRequests();
        // Notify parent component to refresh count
        if (onRequestHandled) {
          onRequestHandled();
        }
      } else {
        toast.error(response.data.message || 'Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to decline friend request');
    } finally {
      setActionLoading(prev => ({ ...prev, [`decline_${requestId}`]: false }));
    }
  };


  if (!isOpen) return null;

  return (
    <div className="w-full mt-4 bg-white rounded-lg border-t border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FaUserFriends className="text-blue-600 text-xl" />
          <h3 className="font-semibold text-gray-800">
            Friend Requests
            {totalRequests > 0 && (
              <span className="ml-2 text-sm text-gray-500">({totalRequests})</span>
            )}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaUserFriends className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No friend requests</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={request.avatar_url || request.avatar || '/perimg.png'}
                      alt={request.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/perimg.png';
                      }}
                    />
                    {request.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {request.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          @{request.username}
                        </p>
                        {request.mutual_friends_count > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {request.mutual_friends_count} mutual friend{request.mutual_friends_count !== 1 ? 's' : ''}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {request.request_time_text}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAcceptRequest(request.user_id, request.id)}
                        disabled={actionLoading[`accept_${request.id}`] || actionLoading[`decline_${request.id}`]}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[`accept_${request.id}`] ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          </div>
                        ) : (
                          'Accept'
                        )}
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request.user_id, request.id)}
                        disabled={actionLoading[`accept_${request.id}`] || actionLoading[`decline_${request.id}`]}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading[`decline_${request.id}`] ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                          </div>
                        ) : (
                          'Decline'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="p-4 text-center border-t border-gray-100">
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendRequests;
