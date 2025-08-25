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
  const navigate = useNavigate();
  const { setCurrentChat } = useChatContext();
  
  const getalluserchats = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('data_type', 'users');
      formData.append('user_type', 'online');
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
      }
    } catch (error) {
      console.log(error);
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


        console.log( 'data?.data', groupConversations);

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

  console.log(conversations, 'conversations');
  console.log(groupConversations, 'groupConversations');
  console.log(activeSection, 'activeSection');
  // Random conversation data


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
        <div className="w-full xl:p-3 lg:p-2 rounded-lg bg-white shadow-[#EDF6F9] shadow-md border border-[#808080] sticky top-8 z-10">
          <div className="flex xl:p-4 lg:p-2 items-center justify-between">
            <div className="relative w-[58px] h-[58px] rounded-full bg-[#EDF6F9] border-[4px] border-inset border-[#ffffff] shadow-md shadow-fuchsia-400">
              <div className="grid place-items-center absolute -right-1 -bottom-1 bg-black w-5 h-5 rounded-full border-inset border-[2px] shadow-2xl shadow-fuchsia-400 border-white">
                <FaPlus className='text-white size-[10px]' />
              </div>
            </div>

            <div className="flex items-center justify-center xl:gap-4 lg:gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500 size-[25px] cursor-pointer' width={24} height={24} viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx={11} cy={11} r={7}></circle>
                  <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
                </g>
              </svg>
              <BiBell className='text-gray-500 size-[25px] cursor-pointer' />
              <CiCircleMore className='text-gray-500 size-[25px] cursor-pointer' />
              <input type="text" placeholder='Search' className='text-gray-500 text-sm outline-none ml-2 w-full bg-transparent hidden transition-colors duration-300 rounded-md p-2' />
            </div>
          </div>
        </div>
      </div>

      {/* Individual/Groups Toggle */}
      <div className="flex flex-col p-5 mt-2.5 bg-white rounded-lg border border-[#808080]">
        <div className="flex w-full items-center justify-between">
          <button 
            onClick={() => setActiveSection('individual')}
            className={`relative flex items-center gap-2 border xl:px-4 lg:px-2 px-2 py-2 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'individual' 
                ? 'border-[#212121] bg-[#f0f0f0]' 
                : 'border-[#808080] bg-white'
            }`}
          >
            <div className="grid absolute bg-[#B3261E] place-items-center w-6 h-6 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
            <FaUser className={`size-[20px] xl:size-[24px] lg:size-[20px] ${
              activeSection === 'individual' ? 'text-[#212121]' : 'text-[#808080]'
            }`} />
            {activeSection === 'individual' && (
              <span className="text-sm font-medium text-[#212121]">Individual</span>
            )}
          </button>

          <button 
            onClick={() => setActiveSection('groups')}
            className={`relative flex items-center gap-2 border xl:px-4 lg:px-2 px-2 py-2 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'groups' 
                ? 'border-[#212121] bg-[#f0f0f0]' 
                : 'border-[#808080] bg-white'
            }`}
          >
            <div className="grid absolute bg-[#B3261E] place-items-center w-5 h-5 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
            <FaUsers className={`size-[24px] xl:size-[32px] lg:size-[24px] ${
              activeSection === 'groups' ? 'text-[#212121]' : 'text-[#808080]'
            }`} />
            {activeSection === 'groups' && (
              <span className="text-sm font-medium text-[#212121]">Groups</span>
            )}
          </button>
        </div>

        <div className="flex flex-col xl:gap-4 lg:gap-2">
          {activeSection === 'individual' ? (
            // Individual Conversations
            conversations && conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div key={conversation.id} className="mt-6 w-full flex items-center justify-between xl:gap-4 lg:gap-2 cursor-pointer" onClick={() => {
                  const userData = {
                    name: conversation?.name,
                    avatar: conversation?.avatar,
                    isOnline: conversation?.isOnline
                  };
                  console.log('Setting current chat:', conversation?.user_id, userData);
                  setCurrentChat(conversation?.user_id, userData);
                  
                  // Store user data in localStorage for persistence
                  localStorage.setItem(`chat_user_${conversation?.user_id}`, JSON.stringify(userData));
                  
                  navigate(`/chat-detailed/${conversation?.user_id}`);
                }}>
                  {/* Profile photo */}
                  <div className="grid size-8 lg:size-10 xl:size-11 rounded-full bg-black relative">
                    <div className={`size-3 lg:size-3 xl:size-4 rounded-full ${conversation.isOnline ? 'bg-[#4CAF50]' : 'bg-gray-400'} absolute -right-0 -bottom-0 border-2 border-inset border-white`}></div>
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
            groupConversations && groupConversations.length > 0 ? (
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
                  <div className="grid size-8 lg:size-10 xl:size-11 rounded-full bg-blue-500 relative">
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
      <div className="p-6 bg-white mt-2.5 rounded-lg border border-[#808080]">
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
      <div className="py-4 px-6 mt-2.5 bg-[#808080] rounded-lg border border-[#808080]">
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
