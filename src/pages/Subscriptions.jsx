import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../utils/constant';
import Loader from '../components/loading/Loader';

const Subscriptions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState({
    users: [],
    pages: [],
    groups: []
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'users', 'pages', 'groups'
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('access_token');
      
      const response = await axios.get(
        `${baseUrl}/api/v1/my-subscriptions?type=all&per_page=20&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.api_status === 200) {
        setSubscriptions(response.data.data);
        setMeta(response.data.meta);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handlePageClick = (pageId) => {
    navigate(`/page/${pageId}`);
  };

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  const renderSubscriptionCard = (item) => {
    const isUser = item.type === 'user';
    const isPage = item.type === 'page';
    const isGroup = item.type === 'group';

    return (
      <div
        key={`${item.type}-${item.id}`}
        className="bg-white rounded-xl p-4 border border-[#d3d1d1] hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => {
          if (isUser) handleUserClick(item.user_id);
          else if (isPage) handlePageClick(item.page_id);
          else if (isGroup) handleGroupClick(item.group_id);
        }}
      >
        <div className="flex items-center gap-4">
          <img
            src={item.avatar_url || '/user.png'}
            alt={isUser ? item.name : isPage ? item.page_name : item.group_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = isUser ? '/user.png' : isPage ? '/icons/page.png' : '/icons/group.png';
            }}
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {isUser ? item.name : isPage ? item.page_name : item.group_name}
              </h3>
              {item.verified && (
                <img src="/icons/verified.png" alt="Verified" className="w-4 h-4" />
              )}
            </div>
            
            {isUser && item.username && (
              <p className="text-sm text-gray-500">@{item.username}</p>
            )}
            
            {isPage && (
              <p className="text-sm text-gray-600 line-clamp-1">{item.page_description}</p>
            )}
            
            {isGroup && (
              <p className="text-sm text-gray-600">{item.privacy_text} Group</p>
            )}
            
            <p className="text-xs text-gray-400 mt-1">
              Subscribed {item.subscribed_at_human}
            </p>
          </div>

          <div className="text-right">
            {isPage && (
              <p className="text-sm text-gray-600">{item.likes_count} likes</p>
            )}
            {isGroup && (
              <p className="text-sm text-gray-600">{item.members_count} members</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getFilteredSubscriptions = () => {
    switch (activeTab) {
      case 'users':
        return subscriptions.users || [];
      case 'pages':
        return subscriptions.pages || [];
      case 'groups':
        return subscriptions.groups || [];
      default:
        return [
          ...(subscriptions.users || []),
          ...(subscriptions.pages || []),
          ...(subscriptions.groups || [])
        ];
    }
  };

  if (loading) {
    return <Loader />;
  }

  const filteredItems = getFilteredSubscriptions();

  return (
    <div className="min-h-screen bg-[#EDF6F9] py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-[#d3d1d1]">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Subscriptions</h1>
          <p className="text-gray-600">
            {meta?.total_subscriptions || 0} total subscriptions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-[#d3d1d1]">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({meta?.total_subscriptions || 0})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Users ({meta?.totals?.users || 0})
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'pages'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pages ({meta?.totals?.pages || 0})
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'groups'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Groups ({meta?.totals?.groups || 0})
            </button>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(renderSubscriptionCard)
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-[#d3d1d1]">
              <p className="text-gray-500 text-lg">No subscriptions found</p>
              <p className="text-gray-400 text-sm mt-2">
                Start following users, pages, and groups to see them here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
