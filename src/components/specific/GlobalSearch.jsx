import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaUsers, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../../context/ChatContext';
import axios from 'axios';

const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { setCurrentChat } = useChatContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'friends', 'pages', 'groups'
  const [searchResults, setSearchResults] = useState({
    users: [],
    friends: [],
    groups: [],
    pages: [],
    channels: []
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchTimeoutRef = useRef(null);

  // Debounced search function
  const performSearch = async (query, filter) => {
    if (!query || query.trim().length === 0) {
      setSearchResults({ users: [], friends: [], groups: [], pages: [], channels: [] });
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const accessToken = localStorage.getItem('access_token');

      if (filter === 'friends') {
        // Search Friends API
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/friends/search`,
          {
            params: {
              term: query.trim(),
              per_page: 12
            },
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data?.data?.users) {
          setSearchResults({
            users: [],
            friends: response.data.data.users || [],
            groups: [],
            pages: [],
            channels: []
          });
        } else {
          setSearchResults({ users: [], friends: [], groups: [], pages: [], channels: [] });
          setSearchError('No friends found');
        }
      } else if (filter === 'pages') {
        // Search Pages API
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/pages/search`,
          {
            params: {
              term: query.trim(),
              per_page: 12,
              page: 1
            },
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data?.data?.pages) {
          setSearchResults({
            users: [],
            friends: [],
            groups: [],
            pages: response.data.data.pages || [],
            channels: []
          });
        } else {
          setSearchResults({ users: [], friends: [], groups: [], pages: [], channels: [] });
          setSearchError('No pages found');
        }
      } else {
        // Global Search API (all)
        const requestBody = {
          search_key: query.trim(),
          limit: 35,
          gender: "",
          status: "",
          image: "",
          country: "",
          verified: "",
          filterbyage: "",
          age_from: 0,
          age_to: 0,
          user_offset: 0,
          page_offset: 0,
          group_offset: 0,
          channels_offset: 0
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/search`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken || ''}`
            }
          }
        );

        if (response.data?.api_status === 200 || response.data?.ok === true) {
          setSearchResults({
            users: response.data.users || [],
            friends: [],
            groups: response.data.groups || [],
            pages: response.data.pages || [],
            channels: response.data.channels || []
          });
        } else {
          setSearchResults({ users: [], friends: [], groups: [], pages: [], channels: [] });
          setSearchError('No results found');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search. Please try again.');
      setSearchResults({ users: [], friends: [], groups: [], pages: [], channels: [] });
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults({ users: [], friends: [], groups: [], pages: [], channels: [] });
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    setSearchLoading(true);

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery, activeFilter);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, activeFilter]);

  // Handle search result click
  const handleSearchResultClick = (item, type) => {
    if (type === 'user' || type === 'friend') {
      const userId = item?.user_id || item?.id;
      navigate(`/profile/${userId}`);
      onClose();
    } else if (type === 'group') {
      const groupData = {
        name: item?.name || item?.group_name,
        avatar: item?.avatar_url || item?.avatar,
        avatar_url: item?.avatar_url || item?.avatar,
        isOnline: true,
        type: 'group'
      };
      setCurrentChat(item?.group_id || item?.id, groupData);
      localStorage.setItem(`chat_user_${item?.group_id || item?.id}`, JSON.stringify(groupData));
      navigate(`/chat-detailed/${item?.group_id || item?.id}`);
      onClose();
    } else if (type === 'page') {
      navigate(`/page/${item?.page_id || item?.id}`);
      onClose();
    } else if (type === 'channel') {
      navigate(`/channel/${item?.channel_id || item?.id}`);
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#d3d1d1] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#d3d1d1]">
          <h2 className="text-lg font-semibold text-gray-900">Search</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close search"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-6 border-b border-[#d3d1d1]">
          <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#d3d1d1] rounded-xl px-4 py-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400 size-[20px]"
              width={20}
              height={20}
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r="7"></circle>
                <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
              </g>
            </svg>
            <input
              type="text"
              placeholder={`Search ${activeFilter === 'all' ? 'everything' : activeFilter}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-gray-800 text-base outline-none border-none bg-transparent"
              autoFocus
            />
            {searchLoading && (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#d3d1d1] overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('friends')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === 'friends'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveFilter('pages')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === 'pages'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pages
          </button>
        </div>

        {/* Search Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {searchError && (
            <div className="text-sm text-red-500 text-center py-4">{searchError}</div>
          )}

          {!searchQuery || searchQuery.trim().length === 0 ? (
            <div className="text-sm text-gray-500 text-center py-8">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p>Start typing to search</p>
              <p className="text-xs text-gray-400 mt-1">Press Esc to close</p>
            </div>
          ) : searchLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Friends Results */}
              {searchResults.friends && searchResults.friends.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="size-4" />
                    Friends ({searchResults.friends.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.friends.map((friend) => (
                      <div
                        key={friend.user_id || friend.id}
                        onClick={() => handleSearchResultClick(friend, 'friend')}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={friend.avatar_url || friend.avatar || "/perimg.png"}
                          alt={friend.name || friend.username || "Friend"}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "/perimg.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {friend.name || friend.username || 'Unknown'}
                          </p>
                          {friend.username && (
                            <p className="text-xs text-gray-500 truncate">@{friend.username}</p>
                          )}
                        </div>
                        <div
                          className={`size-2 rounded-full ${
                            friend.isOnline ? "bg-[#4CAF50]" : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Users Results */}
              {searchResults.users && searchResults.users.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="size-4" />
                    Users ({searchResults.users.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.users.map((user) => (
                      <div
                        key={user.user_id || user.id}
                        onClick={() => handleSearchResultClick(user, 'user')}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={user.avatar_url || user.avatar || "/perimg.png"}
                          alt={user.name || user.username || "User"}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "/perimg.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || user.username || 'Unknown User'}
                          </p>
                          {user.username && (
                            <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                          )}
                        </div>
                        <div
                          className={`size-2 rounded-full ${
                            user.isOnline ? "bg-[#4CAF50]" : "bg-gray-400"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pages Results */}
              {searchResults.pages && searchResults.pages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Pages ({searchResults.pages.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.pages.map((page) => (
                      <div
                        key={page.page_id || page.id}
                        onClick={() => handleSearchResultClick(page, 'page')}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={page.avatar_url || page.avatar || page.page_picture || "/icons/page.png"}
                          alt={page.page_title || page.name || "Page"}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "/icons/page.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {page.page_title || page.name || 'Unknown Page'}
                          </p>
                          {page.page_category && (
                            <p className="text-xs text-gray-500 truncate">{page.page_category}</p>
                          )}
                          {page.likes_count !== undefined && (
                            <p className="text-xs text-gray-500">{page.likes_count} likes</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Groups Results */}
              {searchResults.groups && searchResults.groups.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUsers className="size-4" />
                    Groups ({searchResults.groups.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.groups.map((group) => (
                      <div
                        key={group.group_id || group.id}
                        onClick={() => handleSearchResultClick(group, 'group')}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={group.avatar_url || group.avatar || "/icons/group.png"}
                          alt={group.name || group.group_name || "Group"}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "/icons/group.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {group.name || group.group_name || 'Unknown Group'}
                          </p>
                          {group.members_count !== undefined && (
                            <p className="text-xs text-gray-500">{group.members_count} members</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Channels Results */}
              {searchResults.channels && searchResults.channels.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Channels ({searchResults.channels.length})
                  </h3>
                  <div className="space-y-2">
                    {searchResults.channels.map((channel) => (
                      <div
                        key={channel.channel_id || channel.id}
                        onClick={() => handleSearchResultClick(channel, 'channel')}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <img
                          src={channel.avatar_url || channel.avatar || "/icons/group.png"}
                          alt={channel.name || channel.channel_name || "Channel"}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = "/icons/group.png";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {channel.name || channel.channel_name || 'Unknown Channel'}
                          </p>
                          {channel.members_count !== undefined && (
                            <p className="text-xs text-gray-500">{channel.members_count} members</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery.trim().length > 0 &&
                !searchLoading &&
                searchResults.users.length === 0 &&
                searchResults.friends.length === 0 &&
                searchResults.groups.length === 0 &&
                searchResults.pages.length === 0 &&
                searchResults.channels.length === 0 && (
                  <div className="text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
