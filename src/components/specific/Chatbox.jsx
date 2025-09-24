import React, { useEffect, useState } from 'react'
import { FaPlus, FaUser, FaUsers } from 'react-icons/fa'
import { CiCircleMore } from 'react-icons/ci'
import { BiBell } from 'react-icons/bi'
import { FaTimes } from 'react-icons/fa'
import { HiUsers } from "react-icons/hi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useChatContext } from '../../context/ChatContext';



const Chatbox = ({ onClose, isMobile = false }) => {

  const [conversations, setConversations] = useState([]);
  const [groupConversations, setGroupConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('individual'); // 'individual' or 'groups'
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { setCurrentChat } = useChatContext();

  // Functions to handle popup toggles
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    setNotificationsOpen(false);
    setMoreOptionsOpen(false);
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
      console.log('Chatbox API response:', data);
      if (data?.api_status === 200) {
        console.log('Setting conversations:', data?.data);
        setConversations(data?.data);
      } else {
        console.log('API response not successful, using sample conversations');
        setConversations(sampleConversations);
      }
    } catch (error) {
      console.log('Error fetching conversations:', error);
      console.log('Using sample conversations due to error');
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
      console.log('Group Chatbox API response:', data);
      if (data?.api_status === 200) {
        console.log('Setting group conversations:', data?.data);
        setGroupConversations(data?.data);


        console.log('data?.data', groupConversations);

      } else {

        console.log('Using sample group data:', sampleGroups);
        setGroupConversations(sampleGroups);
      }
    } catch (error) {
      console.log(error);

      console.log('Using sample group data due to error:', sampleGroups);
      setGroupConversations(sampleGroups);
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getalluserchats();
    getallgroupchats();
  }, []);

  useEffect(() => {
    console.log('Active section changed to:', activeSection);
  }, [activeSection]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section')) {
        closeAllPopups();
      }
    };

    // Close search when clicking outside the search input
    const handleSearchClickOutside = (event) => {
      if (searchOpen && !event.target.closest('.search-container')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleSearchClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleSearchClickOutside);
    };
  }, [searchOpen]);

  console.log('Conversations state:', conversations);
  console.log('Group conversations state:', groupConversations);
  console.log('Active section:', activeSection);
  console.log('Conversations length:', conversations?.length || 0);
  console.log('Group conversations length:', groupConversations?.length || 0);


  return (
    <div className={`bg-[#EDF6F9] px-6 py-8 h-full overflow-y-auto scrollbar-hide smooth-scroll pt-0  ${isMobile ? 'w-full' : 'w-full'
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
                 <div className="w-full xl:p-1 lg:p-1 rounded-lg bg-white shadow-[#EDF6F9] shadow-md border border-[#d3d1d1] sticky top-5 z-10 profile-section">
          <div className="flex xl:p-1 lg:p-1 items-center justify-between">
            <div className="relative w-[58px] h-[58px] rounded-full bg-[#EDF6F9] border-[4px] border-inset border-[#ffffff] shadow-md shadow-fuchsia-400">
              <div className="grid place-items-center absolute -right-1 -bottom-1 bg-black w-5 h-5 rounded-full border-inset border-[2px] shadow-2xl shadow-fuchsia-400 border-white">
                <FaPlus className='text-white size-[10px]' />
              </div>
            </div>

            <div className="flex items-center justify-center xl:gap-4 lg:gap-2 relative">
              {/* Search Icon and Input - Inline */}
              <div className="relative flex items-center search-container">
                {!searchOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-500 size-[25px] cursor-pointer transition-colors hover:text-blue-500"
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
                ) : (
                                     <div className="flex items-center gap-2 bg-white border border-[#d3d1d1] rounded-lg px-2 py-1 shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400 size-[18px]"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                    >
                      <g fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx={11} cy={11} r="7"></circle>
                        <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
                      </g>
                    </svg>
                    <input
                      type="text"
                      placeholder='Search...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='w-32 sm:w-8 lg:w-8 text-gray-700 text-sm outline-none border-none bg-transparent'
                      autoFocus
                    />
                    <button
                      onClick={toggleSearch}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Bell Icon and Notifications */}
              <div className="relative">
                <BiBell
                  className={`text-gray-500 size-[25px] cursor-pointer transition-colors hover:text-blue-500 ${notificationsOpen ? 'text-blue-500' : ''}`}
                  onClick={toggleNotifications}
                />

                {/* Simplified Notifications Popup */}
                {notificationsOpen && (
                                       <div className="absolute top-12 right-0 w-60 bg-white border border-[#d3d1d1] rounded-lg shadow-lg p-3 z-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800 text-sm">Notifications</h3>
                      <button className="text-xs text-blue-500 hover:text-blue-700">Mark read</button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">New message from John</p>
                          <p className="text-xs text-gray-500">2 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">Group invitation</p>
                          <p className="text-xs text-gray-500">5 min ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">System update</p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Night Mode
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
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
        </div>
      </div>

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
                    avatar: conversation?.avatar,
                    isOnline: conversation?.isOnline
                  };
                  setCurrentChat(conversation?.user_id, userData);

                  // Store user data in localStorage for persistence
                  localStorage.setItem(`chat_user_${conversation?.user_id}`, JSON.stringify(userData));

                  navigate(`/chat-detailed/${conversation?.user_id}`);
                }}>
                  {/* Profile photo */}
                  <div className="relative grid size-8 lg:size-10 xl:size-11 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={conversation?.avatar || "/perimg.png"}
                      alt={conversation?.name || "User"}
                      className="w-full h-full object-cover"
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
                    avatar: group?.avatar,
                    isOnline: group?.isOnline,
                    type: 'group'
                  };
                  console.log('Setting current group chat:', group?.group_id, groupData);
                  setCurrentChat(group?.group_id, groupData);

                  // Store group data in localStorage for persistence
                  localStorage.setItem(`chat_user_${group?.group_id}`, JSON.stringify(groupData));

                  navigate(`/chat-detailed/${group?.group_id}`);
                }}>
                  {/* Group photo */}
                  <div className="grid size-8 lg:size-10 xl:size-11 rounded-full bg-blue-500 relative overflow-hidden">
                    <img
                      src={group?.avatar || "/icons/group.png"}
                      alt={group?.name || "Group"}
                      className="w-full h-full object-cover"
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
    </div>
  )
}

export default Chatbox
