import axios from 'axios';
import { CheckCircle2, ExternalLink, FileText, Search, User, UserPlus, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    verified: 'all',
    status: 'all',
    gender: 'all',
    profile: 'all',
    age: 'no',
    keyword: '',
    country: 'all',
    college: '',
    university: '',
    age_from: 18,
    age_to: 50,
  });

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
  });

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await axios.get('https://admin.ouptel.in/api/v1/countries', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken || ''}`,
          },
        });
        
        // Handle different possible response structures
        if (response.data) {
          if (Array.isArray(response.data)) {
            setCountries(response.data);
          } else if (response.data.data && Array.isArray(response.data.data)) {
            setCountries(response.data.data);
          } else if (response.data.countries && Array.isArray(response.data.countries)) {
            setCountries(response.data.countries);
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Call API on initial load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    handleSearch();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearch = async (pageOverride = null) => {
    try {
      setLoading(true);

      const currentPage = pageOverride !== null ? pageOverride : pagination.page;

      // Build query parameters
      const params = new URLSearchParams({
        verified: filters.verified,
        status: filters.status,
        image: filters.profile === 'all' ? 'all' : filters.profile,
        filterbyage: filters.age,
        query: filters.keyword || '',
        country: filters.country,
        age_from: filters.age_from.toString(),
        age_to: filters.age_to.toString(),
        per_page: pagination.per_page.toString(),
        page: currentPage.toString(),
      });

      // Add optional parameters if they have values
      if (filters.college) {
        params.append('college', filters.college);
      }
      if (filters.university) {
        params.append('university', filters.university);
      }

      const accessToken = localStorage.getItem('access_token');
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/v1/search/explore?${params.toString()}`;

      console.log('API URL:', apiUrl);
      console.log('Search filters:', filters);

      const response = await axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || ''}`,
        },
      });

      console.log('API Response:', response.data);

      // Update states with API response
      if (response.data && response.data.results) {
        const results = response.data.results;

        // Update users with pagination
        if (results.users && results.users.data) {
          setUsers(results.users.data);
          if (results.users.pagination) {
            setPagination(prev => ({
              ...prev,
              total: results.users.pagination.total || 0,
              last_page: results.users.pagination.last_page || 1,
              page: results.users.pagination.current_page || 1,
              per_page: results.users.pagination.per_page || prev.per_page,
            }));
          }
        } else {
          setUsers([]);
        }

        // Update pages (no pagination for pages)
        if (results.pages && Array.isArray(results.pages)) {
          setPages(results.pages);
        } else {
          setPages([]);
        }

        // Update groups (no pagination for groups)
        if (results.groups && Array.isArray(results.groups)) {
          setGroups(results.groups);
        } else {
          setGroups([]);
        }
      } else {
        setUsers([]);
        setPages([]);
        setGroups([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      console.error('Error response:', error.response?.data);
      setUsers([]);
      setPages([]);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = (userId) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === userId
          ? { ...user, friend_status: 'requested' }
          : user
      )
    );
  };

  const handlePageChange = async (newPage) => {
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Update pagination and trigger search with new page
    setPagination(prev => ({ ...prev, page: newPage }));
    await handleSearch(newPage);
  };

  const getDefaultAvatar = (type = 'user') => {
    if (type === 'page') return 'https://admin.ouptel.in/storage/upload/photos/d-page.jpg';
    if (type === 'group') return 'https://admin.ouptel.in/storage/upload/photos/d-group.jpg';
    return 'https://admin.ouptel.in/storage/upload/photos/d-avatar.jpg';
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
    <div className="min-h-screen bg-[#EDF6F9] p-3 sm:p-4 md:p-6">
      <div className="w-full">
        {/* Header */}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Explore</h1>

        {/* Filter Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm border border-gray-200">
          {/* Top Row - Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4">
            <select
              value={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-3xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2.5rem'
              }}
            >
              <option value="all">Verified : All</option>
              <option value="yes">Verified : Yes</option>
              <option value="no">Verified : No</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-3xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2.5rem'
              }}
            >
              <option value="all">Status : All</option>
              <option value="online">Status : Online</option>
              <option value="offline">Status : Offline</option>
            </select>

            <select
              value={filters.gender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-3xl text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2.5rem'
              }}
            >
              <option value="all">Gender : All</option>
              <option value="male">Gender : Male</option>
              <option value="female">Gender : Female</option>
              <option value="other">Gender : Other</option>
            </select>

            <select
              value={filters.profile}
              onChange={(e) => handleFilterChange('profile', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-3xl text-xs sm:text-sm text-gray-700  hover:border-gray-400 transition-colors cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2.5rem'
              }}
            >
              <option value="all">Profile : All</option>
              <option value="public">Profile : Public</option>
              <option value="private">Profile : Private</option>
            </select>

            <select
              value={filters.age}
              onChange={(e) => handleFilterChange('age', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-3xl text-xs sm:text-sm text-gray-700  hover:border-gray-400 transition-colors cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2.5rem'
              }}
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
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-4xl text-xs sm:text-sm text-gray-700  hover:border-gray-400 transition-colors cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                paddingRight: '2.5rem'
              }}
            >
              <option value="all">Country : All</option>
              {countries.map((country, index) => {
                // Handle different country data structures
                const countryName = typeof country === 'string' 
                  ? country 
                  : country.name || country.country_name || country.country || country.title || '';
                const countryValue = typeof country === 'string' 
                  ? country 
                  : country.name || country.country_name || country.country || country.id || country.code || '';
                
                return countryName ? (
                  <option key={index} value={countryValue}>
                    {countryName}
                  </option>
                ) : null;
              })}
            </select>
          </div>

          {/* Bottom Row - Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
            <input
              type="text"
              placeholder="College"
              value={filters.college}
              onChange={(e) => handleFilterChange('college', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl text-xs sm:text-sm  hover:border-gray-400 transition-colors cursor-pointer appearance-none"
            />

            <input
              type="text"
              placeholder="University"
              value={filters.university}
              onChange={(e) => handleFilterChange('university', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl text-xs sm:text-sm  hover:border-gray-400 transition-colors cursor-pointer appearance-none"
            />
          </div>

          {/* Age Range Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
            <input
              type="number"
              placeholder="Age From"
              value={filters.age_from}
              onChange={(e) => handleFilterChange('age_from', parseInt(e.target.value) || 18)}
              min="18"
              max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl text-xs sm:text-sm  hover:border-gray-400 transition-colors cursor-pointer appearance-none"
            />

            <input
              type="number"
              placeholder="Age To"
              value={filters.age_to}
              onChange={(e) => handleFilterChange('age_to', parseInt(e.target.value) || 50)}
              min="18"
              max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-4xl text-xs sm:text-sm  hover:border-gray-400 transition-colors cursor-pointer appearance-none"
            />
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center cursor-pointer gap-2 px-6 sm:px-8 py-2 bg-blue-600 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'SEARCHING...' : 'SEARCH'}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 cursor-pointer'
              }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === 'pages'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 cursor-pointer'
              }`}
          >
            Pages
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === 'groups'
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
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            )}
            {!loading && users.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-500">No users found. Try adjusting your search filters.</p>
              </div>
            )}
            {!loading && users.length > 0 && pagination.total > 0 && (
              <div className="text-sm text-gray-600 mb-2 px-2">
                Total: {pagination.total.toLocaleString()} users found
              </div>
            )}
            {!loading && users.map((user) => (
              <div
                key={user.user_id}
                className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Profile Picture */}
                    <div className="relative flex-shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ${user.avatar_url ? 'hidden' : 'flex'}`}
                      >
                        <User className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                      </div>
                      {user.is_online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        {user.verified && (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">@{user.username}</p>
                      {!user.is_online && (
                        <p className="text-xs text-gray-400 mt-1">Offline</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons - Fixed position for consistent alignment */}
                  <div className="flex items-center gap-2 sm:gap-3 justify-end sm:justify-start">
                    <button
                      onClick={() => window.open(user.profile_url, '_blank')}
                      className="px-3 sm:px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs sm:text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && users.length > 0 && (
              <div className="mt-6 space-y-4">
                {/* Results Count */}
                <div className="text-center text-sm text-gray-600">
                  Showing {((pagination.page - 1) * pagination.per_page) + 1} - {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total.toLocaleString()} results
                </div>

                {/* Pagination Controls */}
                {pagination.last_page > 1 && (
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      First
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {pagination.page} of {pagination.last_page}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.last_page}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.last_page)}
                      disabled={pagination.page >= pagination.last_page}
                      className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Last
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pages Cards */}
        {activeTab === 'pages' && (
          <div className="space-y-3">
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            )}
            {!loading && pages.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-500">No pages found. Try adjusting your search filters.</p>
              </div>
            )}
            {!loading && pages.length > 0 && (
              <div className="text-sm text-gray-600 mb-2 px-2">
                {pages.length} {pages.length === 1 ? 'page' : 'pages'} found
              </div>
            )}
            {!loading && pages.map((page) => (
              <div
                key={page.page_id}
                className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Page Avatar */}
                    <div className="relative flex-shrink-0">
                      {page.avatar_url ? (
                        <img
                          src={page.avatar_url}
                          alt={page.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ${page.avatar_url ? 'hidden' : 'flex'}`}
                      >
                        <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                      </div>
                    </div>

                    {/* Page Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                          {page.name}
                        </h3>
                        {page.verified && (
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">@{page.slug}</p>
                    </div>
                  </div>

                  {/* Action Button - Fixed position for consistent alignment */}
                  <div className="flex items-center gap-2 sm:gap-3 justify-end sm:justify-start">
                    <button
                      onClick={() => navigate(`/page/${encodeURIComponent(page.slug)}`)}
                      className="px-3 cursor-pointer sm:px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs sm:text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View Page</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Groups Cards */}
        {activeTab === 'groups' && (
          <div className="space-y-3">
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            )}
            {!loading && groups.length === 0 && (
              <div className="text-center py-8 bg-white rounded-lg">
                <p className="text-gray-500">No groups found. Try adjusting your search filters.</p>
              </div>
            )}
            {!loading && groups.length > 0 && (
              <div className="text-sm text-gray-600 mb-2 px-2">
                {groups.length} {groups.length === 1 ? 'group' : 'groups'} found
              </div>
            )}
            {!loading && groups.map((group) => (
              <div
                key={group.group_id}
                className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-center">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    {/* Group Avatar */}
                    <div className="relative flex-shrink-0">
                      {group.avatar_url?.trim() ? (
                        <img
                          src={group.avatar_url.trim()}
                          alt={group.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ${group.avatar_url?.trim() ? 'hidden' : 'flex'}`}
                      >
                        <Users className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                      </div>
                    </div>

                    {/* Group Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                        {group.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {group.privacy === '1' ? 'Public' : 'Private'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs sm:text-sm text-gray-500">Group</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button - Fixed position for consistent alignment */}
                  <div className="flex items-center gap-2 sm:gap-3 justify-end sm:justify-start">
                    <button
                      onClick={() => navigate(`/group/${group.group_id}`)}
                      className="px-3 cursor-pointer sm:px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs sm:text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>View Group</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;