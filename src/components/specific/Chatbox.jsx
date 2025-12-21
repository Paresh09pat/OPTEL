import React, { useEffect, useState, useRef } from 'react'
import { FaPlus, FaUser, FaUsers } from 'react-icons/fa'
import { CiCircleMore } from 'react-icons/ci'
import { BiBell } from 'react-icons/bi'
import { FaTimes } from 'react-icons/fa'
import { HiUsers } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useNavigate, Link } from 'react-router-dom';
import { useChatContext } from '../../context/ChatContext';
import { useUser } from '../../context/UserContext';
import StoryCreateModal from './StoryCreateModal';
import StoryViewer from './StoryViewer';
import Notifications from './Notifications';



const Chatbox = ({ onClose, isMobile = false }) => {
  const { userData } = useUser();

  const [conversations, setConversations] = useState([]);
  const [groupConversations, setGroupConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('individual'); // 'individual' or 'groups'
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ users: [], groups: [], pages: [], channels: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const searchTimeoutRef = useRef(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [storyBorderAnimating, setStoryBorderAnimating] = useState(false);
  const containerRef = useRef(null);
  const [containerRect, setContainerRect] = useState(null);
  const navigate = useNavigate();
  const { setCurrentChat } = useChatContext();

  // Handle logout
  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('session_id');
    localStorage.removeItem('isVerified');
    localStorage.removeItem('membership');
    localStorage.removeItem('signup_user_data');
    
    // Close the popup
    setMoreOptionsOpen(false);
    
    // Navigate to login page
    navigate('/login');
  };

  // Functions to handle popup toggles
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setNotificationsOpen(false);
    setMoreOptionsOpen(false);
    // Reset search when closing
    if (searchOpen) {
      setSearchQuery('');
      setSearchResults({ users: [], groups: [], pages: [], channels: [] });
      setSearchError(null);
    }
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setSearchOpen(false);
    setMoreOptionsOpen(false);
  };

  const toggleMoreOptions = () => {
    setMoreOptionsOpen(!moreOptionsOpen);
    setSearchOpen(false);
    setNotificationsOpen(false);
  };

  const closeAllPopups = () => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setMoreOptionsOpen(false);
  };

  // Sample data for testing when API fails
  const sampleGroups = [
    {
      id: 1,
      group_id: 'group1',
      name: 'Tech Enthusiasts',
      avatar: '/icons/group.png',
      message: 'Latest tech updates!',
      time: '2 min ago',
      isOnline: true
    },
    {
      id: 2,
      group_id: 'group2',
      name: 'Design Community',
      avatar: '/icons/group.png',
      message: 'New design trends',
      time: '5 min ago',
      isOnline: true
    }
  ];

  const sampleConversations = [
    {
      id: 1,
      user_id: 'user1',
      name: 'John Doe',
      avatar: '/perimg.png',
      message: 'Hey, how are you?',
      time: '2 min ago',
      isOnline: true
    },
    {
      id: 2,
      user_id: 'user2',
      name: 'Jane Smith',
      avatar: '/perimg.png',
      message: 'Great to see you!',
      time: '5 min ago',
      isOnline: false
    }
  ];

  const getalluserchats = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('data_type', 'users');
      // Removed user_type restriction to get all users, not just online ones
      const response = await fetch(`https://ouptel.com/api/get_chats?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          "Accept": "application/json"
        },
        body: formData.toString(),
      });
      const data = await response.json();
      if (data?.api_status === 200) {
            setConversations(data?.data);
      } else {
        setConversations(sampleConversations);
      }
    } catch (error) {
      setConversations(sampleConversations);
    }
    finally {
      setLoading(false);
    }
  }

  const getallgroupchats = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'get_list');
      const response = await fetch(`https://ouptel.com/api/group_chat?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          "Accept": "application/json"
        },
        body: formData.toString(),
      });
      const data = await response.json();
      if (data?.api_status === 200) {
        setGroupConversations(data?.data);
      } else {

        setGroupConversations(sampleGroups);
      }
    } catch (error) {
      setGroupConversations(sampleGroups);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getalluserchats();
    getallgroupchats();
    fetchUserStories();
  }, []);

  // Fetch user stories
  const fetchUserStories = async () => {
    setStoriesLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/stories/user-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          limit: 20,
          offset: 0
        }),
      });

      const data = await response.json();
      if (data?.api_status === 200 && data?.stories && data.stories.length > 0) {
        // Find current user's stories
        const userId = localStorage.getItem('user_id');
        const currentUserStories = data.stories.find(
          (storyGroup) => storyGroup.user_id.toString() === userId.toString()
        );
        if (currentUserStories && currentUserStories.stories && currentUserStories.stories.length > 0) {
          setUserStories(currentUserStories.stories);
        } else {
          setUserStories([]);
        }
      } else {
        setUserStories([]);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setUserStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  // Handle profile image click - show stories if exist, otherwise show create modal
  const handleProfileImageClick = () => {
    if (userStories && userStories.length > 0) {
      // Trigger animation on click
      setStoryBorderAnimating(true);
      setTimeout(() => {
        setStoryBorderAnimating(false);
      }, 600); // Animation duration
      setStoryViewerOpen(true);
    } else {
      setStoryModalOpen(true);
    }
  };

  // Debounced global search function
  const performGlobalSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults({ users: [], groups: [], pages: [], channels: [] });
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const accessToken = localStorage.getItem('access_token');
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || ''}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data?.api_status === 200 || response.ok) {
        // Response structure: users, pages, groups, channels at root level
        setSearchResults({
          users: data.users || [],
          groups: data.groups || [],
          pages: data.pages || [],
          channels: data.channels || [],
        });
      } else {
        setSearchResults({ users: [], groups: [], pages: [], channels: [] });
        setSearchError('No results found');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search. Please try again.');
      setSearchResults({ users: [], groups: [], pages: [], channels: [] });
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search input
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If search query is empty, clear results immediately
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults({ users: [], groups: [], pages: [], channels: [] });
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    // Set loading state immediately
    setSearchLoading(true);

    // Debounce the search API call
    searchTimeoutRef.current = setTimeout(() => {
      performGlobalSearch(searchQuery);
    }, 500); // 500ms debounce delay

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Handle search result click - navigate to user/group/page
  const handleSearchResultClick = (item, type) => {
    if (type === 'user') {
      // Navigate to user profile page
      const userId = item?.user_id || item?.id;
      navigate(`/profile/${userId}`);
      setSearchOpen(false);
      setSearchQuery('');
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
      setSearchOpen(false);
      setSearchQuery('');
    } else if (type === 'page') {
      navigate(`/page/${item?.page_id || item?.id}`);
      setSearchOpen(false);
      setSearchQuery('');
    } else if (type === 'channel') {
      // Handle channel navigation - adjust route as needed
      navigate(`/channel/${item?.channel_id || item?.id}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
  }, [activeSection]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  // Track container bounds for notification overlay alignment
  useEffect(() => {
    const updateContainerRect = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
        });
      }
    };

    if (notificationsOpen) {
      updateContainerRect();
      window.addEventListener('resize', updateContainerRect);
      window.addEventListener('scroll', updateContainerRect, true);
    }

    return () => {
      window.removeEventListener('resize', updateContainerRect);
      window.removeEventListener('scroll', updateContainerRect, true);
    };
  }, [notificationsOpen]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section')) {
        closeAllPopups();
      }
    };

    // Don't close search modal when clicking inside it
    const handleSearchClickOutside = (event) => {
      // Only handle if search modal is open and click is outside the modal
      if (searchOpen) {
        const modalContent = event.target.closest('.search-modal-content');
        if (!modalContent) {
          // Click is outside the modal, close it
          setSearchOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // Only add search click handler when search is open
    if (searchOpen) {
      document.addEventListener('mousedown', handleSearchClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleSearchClickOutside);
    };
  }, [searchOpen]);

 

  return (
    <div ref={containerRef} className={`relative bg-[#EDF6F9] px-6 py-8 h-full overflow-y-auto scrollbar-hide smooth-scroll pt-0  ${isMobile ? 'w-full' : 'w-full'
      }`}>
      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex justify-between items-center mb-4 lg:hidden pt-4">
          <h2 className="text-xl font-semibold text-gray-800">Messages & Activity</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="pt-8 sticky top-0 z-10 bg-[#EDF6F9] ">
        <div className={`w-full xl:p-1 lg:p-1 rounded-lg bg-white shadow-[#EDF6F9] shadow-md border border-[#d3d1d1] sticky top-5 z-10 profile-section  ${notificationsOpen ? 'min-h-[70vh]' : ''}`}>
          <div className="flex xl:p-1 lg:p-1 items-center justify-between">
            <div className="relative">
              {/* Story indicator border - Instagram style gradient ring with click animation */}
              {userStories && userStories.length > 0 && (
                <div 
                  className="absolute inset-[-3px] rounded-full z-[-1]"
                  style={{
                    background: 'conic-gradient(from 0deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%, #f09433 100%)',
                    animation: storyBorderAnimating ? 'spin-gradient-once 0.6s ease-out' : 'none',
                  }}
                />
              )}
              <div 
                className="relative w-[58px] h-[58px] rounded-full bg-[#EDF6F9] border-[4px] border-inset border-[#ffffff] shadow-md shadow-fuchsia-400 cursor-pointer hover:opacity-90 transition-opacity z-10"
                onClick={handleProfileImageClick}
              >
                {userData?.avatar_url ? (
                  <img 
                    src={userData.avatar_url || "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80"} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <FaUser className="text-gray-600 text-xl" />
                  </div>
                )}
                <div 
                  className="grid place-items-center absolute -right-1 -bottom-1 bg-black w-5 h-5 rounded-full border-inset border-[2px] shadow-2xl shadow-fuchsia-400 border-white cursor-pointer hover:bg-gray-800 transition-colors z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setStoryModalOpen(true);
                  }}
                >
                  <FaPlus className='text-white size-[10px]' />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center xl:gap-4 lg:gap-2 relative">
              {/* Search Icon and Input - Inline */}
              <div className="relative flex items-center search-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`text-gray-500 size-[25px] cursor-pointer transition-colors hover:text-blue-500 ${searchOpen ? 'text-blue-500' : ''}`}
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  onClick={toggleSearch}
                >
                  <g fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx={11} cy={11} r="7"></circle>
                    <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
                  </g>
                </svg>
              </div>

              {/* Bell Icon and Notifications */}
              <div className="relative">
                <BiBell
                  className={`text-gray-500 size-[25px] cursor-pointer transition-colors hover:text-blue-500 ${notificationsOpen ? 'text-blue-500' : ''}`}
                  onClick={toggleNotifications}
                />
              </div>

              {/* More Options Icon */}
              <div className="relative">
                <CiCircleMore
                  className={`text-gray-500 size-[25px] cursor-pointer transition-colors hover:text-blue-500 ${moreOptionsOpen ? 'text-blue-500' : ''}`}
                  onClick={toggleMoreOptions}
                />

                {/* More Options Popup */}
                {moreOptionsOpen && (
                  <div className="absolute top-10 right-0 w-44 bg-white border border-[#d3d1d1] rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setMoreOptionsOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/profile-settings"
                      onClick={() => setMoreOptionsOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </Link>
                    <Link
                      to="/profile-settings"
                      onClick={() => setMoreOptionsOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Night Mode
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Full width notifications drawer */}
          <Notifications 
            isOpen={notificationsOpen}
            onClose={toggleNotifications}
            containerRect={containerRect}
          />
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={(e) => {
            // Only close if clicking directly on the backdrop, not on child elements
            if (e.target === e.currentTarget) {
              toggleSearch();
            }
          }}
        >
          <div
            className="search-modal-content w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#d3d1d1] p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">Global Search</p>
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close search modal"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 bg-[#F8FAFC] border border-[#d3d1d1] rounded-xl px-4 py-3 shadow-inner">
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
                placeholder="Search users, groups, pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full text-gray-800 text-base outline-none border-none bg-transparent"
                autoFocus
              />
              {searchLoading && (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {searchError && (
                <div className="text-sm text-red-500 text-center py-2">{searchError}</div>
              )}

              {!searchQuery || searchQuery.trim().length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  Start typing to search for users, groups, and pages. Press `Esc` or click outside to close.
                </div>
              ) : searchLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-sm text-gray-500">Searching...</p>
                </div>
              ) : (
                <>
                  {/* Users Results */}
                  {searchResults.users && searchResults.users.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaUser className="size-4" />
                        Users ({searchResults.users.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.users.map((user) => (
                          <div
                            key={user.user_id || user.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSearchResultClick(user, 'user');
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <img
                              src={user.avatar_url || user.avatar || "/perimg.png"}
                              alt={user.name || user.username || user.full_name || "User"}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = "/perimg.png";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name || user.username || user.full_name || 'Unknown User'}
                              </p>
                              {user.username && user.username !== (user.name || user.full_name) && (
                                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                              )}
                            </div>
                            <div
                              className={`size-2 rounded-full ${user.isOnline ? "bg-[#4CAF50]" : "bg-gray-400"}`}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Groups Results */}
                  {searchResults.groups && searchResults.groups.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaUsers className="size-4" />
                        Groups ({searchResults.groups.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.groups.map((group) => (
                          <div
                            key={group.group_id || group.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSearchResultClick(group, 'group');
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <img
                              src={group.avatar_url || group.avatar || "/icons/group.png"}
                              alt={group.name || group.group_name || "Group"}
                              className="w-10 h-10 rounded-full object-cover"
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

                  {/* Pages Results */}
                  {searchResults.pages && searchResults.pages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Pages ({searchResults.pages.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.pages.map((page) => (
                          <div
                            key={page.page_id || page.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSearchResultClick(page, 'page');
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <img
                              src={page.avatar_url || page.avatar || page.page_picture || "/icons/group.png"}
                              alt={page.page_title || page.name || "Page"}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = "/icons/group.png";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {page.page_title || page.name || 'Unknown Page'}
                              </p>
                              {page.likes_count !== undefined && (
                                <p className="text-xs text-gray-500">{page.likes_count} likes</p>
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
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Channels ({searchResults.channels.length})
                      </h3>
                      <div className="space-y-2">
                        {searchResults.channels.map((channel) => (
                          <div
                            key={channel.channel_id || channel.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSearchResultClick(channel, 'channel');
                            }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <img
                              src={channel.avatar_url || channel.avatar || "/icons/group.png"}
                              alt={channel.name || channel.channel_name || "Channel"}
                              className="w-10 h-10 rounded-full object-cover"
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
                    searchResults.groups.length === 0 &&
                    searchResults.pages.length === 0 &&
                    searchResults.channels.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Individual/Groups Toggle */}
             <div className="flex flex-col p-2 mt-2 bg-white rounded-lg border border-[#d3d1d1]">
        <div className="flex w-full items-center justify-around">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveSection('individual')}
              className={`relative flex items-center gap-2 border xl:px-4 lg:px-2 px-2 py-1 rounded-xl cursor-pointer transition-all duration-200 ${activeSection === 'individual'
                ? 'border-[#212121] bg-[#f0f0f0]'
                : 'border-[#d3d1d1] bg-white'
                }`}
            >
              <div className="grid absolute bg-[#B3261E] place-items-center w-6 h-6 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
              <FaUser className={`size-[20px] xl:size-[24px] lg:size-[20px] ${activeSection === 'individual' ? 'text-[#212121]' : 'text-[#808080]'
                }`} />
              {activeSection === 'individual' && (
                <span className="text-sm font-medium text-[#212121]">Individual</span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('groups')}
              className={`relative flex items-center gap-2 border xl:px-4 lg:px-2 px-2 py-1 rounded-xl cursor-pointer transition-all duration-200 ${activeSection === 'groups'
                ? 'border-[#212121] bg-[#f0f0f0]'
                : 'border-[#d3d1d1] bg-white'
                }`}
            >
              <div className="grid absolute bg-[#B3261E] place-items-center w-5 h-5 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
              <FaUsers className={`size-[20px] xl:size-[24px] lg:size-[20px] ${activeSection === 'groups' ? 'text-[#212121]' : 'text-[#808080]'
                }`} />
              {activeSection === 'groups' && (
                <span className="text-sm font-medium text-[#212121]">Groups</span>
              )}
            </button>
          </div>
        </div>

        {/* Refresh Button */}
        {/* <div className="flex justify-end mt-2">
          <button
            onClick={() => {
              if (activeSection === 'individual') {
                getalluserchats();
              } else {
                getallgroupchats();
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Refresh {activeSection === 'individual' ? 'Conversations' : 'Groups'}
          </button>
        </div> */}

        <div className="flex flex-col xl:gap-4 lg:gap-2">
          {activeSection === 'individual' ? (
            // Individual Conversations
            loading ? (
              <div className="mt-4 text-center text-gray-500">
                <div className="w-6 h-6 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-2 border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading conversations...</p>
              </div>
            ) : conversations && conversations.length > 0 ? (
              conversations.map((conversation) => (
                  <div key={conversation.id} className="mt-4 w-full flex items-center xl:gap-4 lg:gap-2 cursor-pointer" onClick={() => {
                  const userData = {
                    name: conversation?.name,
                    avatar: conversation?.avatar_url || conversation?.avatar,
                    avatar_url: conversation?.avatar_url || conversation?.avatar,
                    isOnline: conversation?.isOnline
                  };
                  setCurrentChat(conversation?.user_id, userData);

                  // Store user data in localStorage for persistence
                  localStorage.setItem(`chat_user_${conversation?.user_id}`, JSON.stringify(userData));

                  navigate(`/chat-detailed/${conversation?.user_id}`);
                }}>
                  {/* Profile photo */}
                  <div className="relative grid ">
                    <img
                      src={conversation?.avatar_url || conversation?.avatar || "/perimg.png"}
                      alt={conversation?.name || "User"}
                      className="size-8 lg:size-10 xl:size-11 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "/perimg.png";
                      }}
                    />
                    <div
                      className={`absolute bottom-0 right-0 size-3 lg:size-3 xl:size-4 
                rounded-full border-2 border-white
                ${conversation.isOnline ? "bg-[#4CAF50]" : "bg-gray-400"}`}
                    ></div>
                  </div>


                  <div className="flex flex-col gap-1">
                    <p className="xl:text-sm lg:text-xs text-sm font-semibold text-[#212121]">{conversation.name}</p>
                    <p className="xl:text-xs lg:text-xs text-xs text-[#212121] line-clamp-1">{conversation.message}</p>
                  </div>
                  <span className='text-[#212121] xl:text-sm lg:text-xs text-xs font-medium'>{conversation.time}</span>
                </div>
              ))
            ) : (
              <div className="mt-6 text-center text-gray-500">
                <p>No individual conversations found</p>
              </div>
            )
          ) : (
            // Group Conversations
            loading ? (
              <div className="mt-6 text-center text-gray-500">
                <div className="w-6 h-6 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-2 border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p>Loading groups...</p>
              </div>
            ) : groupConversations && groupConversations.length > 0 ? (
              groupConversations.map((group) => (
                <div key={group.id} className="mt-6 w-full flex items-center justify-between xl:gap-4 lg:gap-2 cursor-pointer" onClick={() => {
                  const groupData = {
                    name: group?.name,
                    avatar: group?.avatar_url || group?.avatar,
                    avatar_url: group?.avatar_url || group?.avatar,
                    isOnline: group?.isOnline,
                    type: 'group'
                  };
                  setCurrentChat(group?.group_id, groupData);

                  // Store group data in localStorage for persistence
                  localStorage.setItem(`chat_user_${group?.group_id}`, JSON.stringify(groupData));

                  navigate(`/chat-detailed/${group?.group_id}`);
                }}>
                  {/* Group photo */}
                  <div className="relative grid ">
                    <img
                      src={group?.avatar_url || group?.avatar || "/icons/group.png"}
                      alt={group?.name || "Group"}
                      className="size-8 lg:size-10 xl:size-11 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "/icons/group.png";
                      }}
                    />
                    <div className="size-3 lg:size-3 xl:size-4 rounded-full bg-[#4CAF50] absolute -right-0 -bottom-0 border-2 border-inset border-white"></div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="xl:text-sm lg:text-xs text-sm font-semibold text-[#212121]">{group.name}</p>
                    <p className="xl:text-xs lg:text-xs text-xs text-[#212121] line-clamp-1">{group.message}</p>
                  </div>
                  <span className='text-[#212121] xl:text-sm lg:text-xs text-xs font-medium'>{group.time}</span>
                </div>
              ))
            ) : (
              <div className="mt-6 text-center text-gray-500">
                <p>No group conversations found</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="px-6 py-2 bg-white mt-2 rounded-lg border border-[#d3d1d1]">
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-semibold text-[#212121]">Trending Topics</h5>
          <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500 size-[25px] cursor-pointer' width={24} height={24} viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={7}></circle>
              <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
            </g>
          </svg>
        </div>

        <div className="space-y-1 mt-5">
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
            <a href="#" className="font-medium ">#Technology</a>
            <p className="text-sm ">12.5k posts</p>
          </div>
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
            <a href="#" className="font-medium ">#Technology</a>
            <p className="text-sm ">12.5k posts</p>
          </div>
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
            <a href="#" className="font-medium ">#Technology</a>
            <p className="text-sm ">12.5k posts</p>
          </div>
          <div className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121]">
            <FaArrowTrendUp />
            <a href="#" className="font-medium ">#Technology</a>
            <p className="text-sm ">12.5k posts</p>
          </div>

        </div>
      </div>

      {/* Who to Follow */}
      <div className="py-4 px-6 mt-2.5 bg-[#808080] rounded-lg border border-[#d3d1d1]">
        <img src="/logos/ouptelfootericon.svg" alt="ouptel-logo" />
        <div className="grid grid-cols-2 gap-11 text-white mt-3.5 text-[12px]">
          <div className="flex flex-col gap-1.5 ">
            <a href="">About us</a>
            <a href="">Blogs</a>
            <a href="">Contact us</a>
            <a href="">Developers</a>
          </div>
          <div className="flex flex-col gap-1.5 ">
            <a href="">Languages</a>
            <a href="">Terms & Condition</a>
            <a href="">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Story Create Modal */}
      <StoryCreateModal 
        isOpen={storyModalOpen} 
        onClose={() => setStoryModalOpen(false)}
        onStoryCreated={fetchUserStories}
      />

      {/* Story Viewer */}
      {userStories && userStories.length > 0 && (
        <StoryViewer
          isOpen={storyViewerOpen}
          onClose={() => setStoryViewerOpen(false)}
          stories={userStories}
          currentUser={userData}
          onStoryDeleted={fetchUserStories}
        />
      )}

    </div>
  )
}

export default Chatbox
