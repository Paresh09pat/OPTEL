import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Check } from 'lucide-react';

const Explore = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    verified: 'all',
    status: 'all',
    gender: 'all',
    profile: 'all',
    age: 'yes',
    keyword: '',
    country: 'all',
    college: '',
    university: '',
  });

  // Load sample data on mount
  useEffect(() => {
    setUsers([
      {
        id: 1,
        first_name: 'Siddharth',
        last_name: 'Verma',
        username: 'muscleManSid',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        posts_count: 20,
        followers_count: 420,
        is_online: false,
        last_seen: '30min Ago',
        friend_status: 'none',
      },
      {
        id: 2,
        first_name: 'Sana',
        last_name: 'Qadri',
        username: 'sanskariSana',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        posts_count: 25,
        followers_count: 20000,
        is_online: true,
        last_seen: null,
        friend_status: 'requested',
      },
      {
        id: 3,
        first_name: 'Aniket',
        last_name: 'Naik',
        username: 'athleteAniket',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        posts_count: 500,
        followers_count: 123000,
        is_online: false,
        last_seen: '30min Ago',
        friend_status: 'requested',
      },
    ]);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = () => {
    console.log('Search with filters:', filters);
  };

  const handleFriendRequest = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, friend_status: 'requested' }
          : user
      )
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Explore</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm border border-gray-200">
          {/* Top Row - Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
            <select
              value={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.value)}
              className="w-full px-3 py-2 bg-white border-none rounded text-xs sm:text-sm focus:outline-none"
            >
              <option value="all">Verified : All</option>
              <option value="yes">Verified : Yes</option>
              <option value="no">Verified : No</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-white border-none rounded text-xs sm:text-sm focus:outline-none"
            >
              <option value="all">Status : All</option>
              <option value="online">Status : Online</option>
              <option value="offline">Status : Offline</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-3 py-2 bg-white border-none rounded text-xs sm:text-sm focus:outline-none"
            >
              <option value="all">Gender : All</option>
              <option value="male">Gender : Male</option>
              <option value="female">Gender : Female</option>
              <option value="other">Gender : Other</option>
            </select>

            <select
              value={filters.profile}
              onChange={(e) => handleFilterChange('profile', e.target.value)}
              className="w-full px-3 py-2 bg-white border-none rounded text-xs sm:text-sm focus:outline-none"
            >
              <option value="all">Profile : All</option>
              <option value="public">Profile : Public</option>
              <option value="private">Profile : Private</option>
            </select>

            <select
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="w-full px-3 py-2 bg-white border-none rounded text-xs sm:text-sm focus:outline-none"
            >
              <option value="yes">Age : Yes</option>
              <option value="no">Age : No</option>
            </select>
          </div>

          {/* Middle Row - Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
            <input
              type="text"
              placeholder="Keyword"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-4xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-4xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Country : All</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>

          {/* Bottom Row - Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
            <input
              type="text"
              placeholder="College"
              value={filters.college}
              onChange={(e) => handleFilterChange('college', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-4xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />

            <input
              type="text"
              placeholder="University"
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-4xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 sm:px-8 py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>SEARCH</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 cursor-pointer'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'pages'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 cursor-pointer'
            }`}
          >
            Pages
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'groups'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 cursor-pointer'
            }`}
          >
            Groups
          </button>
        </div>

        {/* User Cards */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {/* Profile Picture */}
                    <img
                      src={user.avatar_url}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                    />

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">@{user.username}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                        {user.posts_count}
                      </div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    
                    <div className="w-px h-8 sm:h-10 bg-gray-300"></div>
                    
                    <div className="text-center">
                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                        {formatNumber(user.followers_count)}
                      </div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                  </div>

                  {/* Status and Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto sm:ml-6">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          user.is_online ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></div>
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {user.is_online ? 'Online' : `Last Seen ${user.last_seen}`}
                      </span>
                    </div>

                    {/* Action Button */}
                    {user.friend_status === 'friends' ? (
                      <button
                        disabled
                        className="px-3 sm:px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs sm:text-sm flex items-center gap-2 cursor-not-allowed whitespace-nowrap"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Friends</span>
                      </button>
                    ) : user.friend_status === 'requested' ? (
                      <button
                        disabled
                        className="px-3 sm:px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs sm:text-sm flex items-center gap-2 cursor-not-allowed whitespace-nowrap"
                      >
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Request sent</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFriendRequest(user.id)}
                        className="px-3 sm:px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full text-xs sm:text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Add Friend</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-500">Pages section coming soon.</p>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-500">Groups section coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;