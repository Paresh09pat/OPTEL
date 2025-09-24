import React, { useEffect, useRef, useState } from 'react'
import { FaCheck, FaPaperPlane } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { useChatContext } from '../context/ChatContext';

const ChatDetailed = ({ name }) => {
    const { chatId } = useParams();
    const { currentChatUser, setCurrentChat, clearCurrentChat } = useChatContext();
    console.log(chatId, 'chatId');
    console.log('Current chat user from context:', currentChatUser);
    const chatContainerRef = useRef(null)
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [messageText, setMessageText] = useState('');

    // Function to fetch user data by chatId
    const getUserData = async () => {
        // Only fetch if we don't have the user data for this chatId
        if (currentChatUser && currentChatUser.chatId === chatId) {
            console.log('User data already available for chatId:', chatId);
            return;
        }

        // Prevent multiple simultaneous API calls
        if (userLoading) {
            console.log('User data already being fetched, skipping...');
            return;
        }

        // Ensure chatId is valid
        if (!chatId) {
            console.log('No chatId provided, skipping user data fetch');
            setUserLoading(false);
            return;
        }

        console.log('Fetching user data for chatId:', chatId);
        setUserLoading(true);

        // First, try to get user data from localStorage (if it was stored when navigating from Chatbox)
        const storedUserData = localStorage.getItem(`chat_user_${chatId}`);
        if (storedUserData) {
            try {
                const parsedData = JSON.parse(storedUserData);
                const userData = {
                    ...parsedData,
                    chatId: chatId
                };
                console.log('Using stored user data:', userData);
                setCurrentChat(chatId, userData);
                setUserLoading(false);
                return;
            } catch (e) {
                console.log('Error parsing stored user data:', e);
            }
        }

        try {
            const accessToken = localStorage.getItem("access_token");
            if (!accessToken) {
                console.log('No access token found, using fallback user data');
                const fallbackUserData = {
                    name: 'Unknown User',
                    avatar: "/perimg.png",
                    isOnline: false,
                    chatId: chatId
                };
                setCurrentChat(chatId, fallbackUserData);
                localStorage.setItem(`chat_user_${chatId}`, JSON.stringify(fallbackUserData));
                return;
            }

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
            console.log('User data API response:', data);

            if (data?.api_status === 200 && data?.data && Array.isArray(data.data)) {
                // Find the specific user by chatId
                const user = data.data.find(u => u.user_id === chatId);
                if (user && user.name) {
                    const userData = {
                        name: user.name || 'Unknown User',
                        avatar: user.avatar || "/perimg.png",
                        isOnline: user.isOnline || false,
                        chatId: chatId
                    };

                    console.log('Setting user data in context:', userData);
                    setCurrentChat(chatId, userData);

                    // Store in localStorage for future use
                    localStorage.setItem(`chat_user_${chatId}`, JSON.stringify(userData));
                    return;
                } else {
                    console.log('User not found or invalid user data:', user);
                }
            } else {
                console.log('API response not in expected format:', data);
            }

            // Fallback: create basic user data if user not found
            const fallbackUserData = {
                name: 'Unknown User',
                avatar: "/perimg.png",
                isOnline: false,
                chatId: chatId
            };

            console.log('Setting fallback user data in context:', fallbackUserData);
            setCurrentChat(chatId, fallbackUserData);

            // Store fallback data in localStorage
            localStorage.setItem(`chat_user_${chatId}`, JSON.stringify(fallbackUserData));
        } catch (error) {
            console.log('Error fetching user data:', error);
            // Fallback: create basic user data if API fails
            const fallbackUserData = {
                name: 'Unknown User',
                avatar: "/perimg.png",
                isOnline: false,
                chatId: chatId
            };

            console.log('Setting fallback user data in context due to error:', fallbackUserData);
            setCurrentChat(chatId, fallbackUserData);

            // Store fallback data in localStorage
            localStorage.setItem(`chat_user_${chatId}`, JSON.stringify(fallbackUserData));
        } finally {
            setUserLoading(false);
        }
    };

    const getchatmessages = async () => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const userid = localStorage.getItem("user_id");
            const sessionid = localStorage.getItem("session_id");
            const formData = new URLSearchParams();

            formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
            formData.append('recipient_id', chatId);
            formData.append('s', sessionid);
            formData.append('user_id', userid);
            const response = await fetch(`https://ouptel.com/app_api.php?application=phone&type=get_user_messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    "Accept": "application/json"
                },
                body: formData.toString(),
            })
            const data = await response.json();
            console.log(data, 'data-detailed');
            if (data?.api_status === "200") {
                setChatMessages(data?.messages);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Always fetch user data when chatId changes
        getUserData();
        getchatmessages();

        // Cleanup function to remove old user data from localStorage
        return () => {
            // Keep only the current chat user data, remove others
            const currentChatUserKey = `chat_user_${chatId}`;
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('chat_user_') && key !== currentChatUserKey) {
                    localStorage.removeItem(key);
                }
            });

            // Note: We don't clear the context here to preserve user data when navigating back
        };
    }, [chatId]);

    useEffect(() => {
        console.log('Context changed - currentChatUser:', currentChatUser);
        console.log('Current chatId from params:', chatId);
        console.log('Context currentChatId:', currentChatUser?.chatId);

    }, [currentChatUser, chatId]);

    console.log(chatMessages, 'chatMessages-detailed');


    console.log(chatMessages, 'chatMessages');

    const DeliveryStatus = ({ isDelivered, isRead }) => (
        <div className="flex items-center justify-center w-4 h-4 bg-[#EDF6F9] rounded-sm ml-2">
            {isRead ? (
                <div className="flex">
                    <FaCheck className="text-blue-500 text-[8px] -mr-1" />
                    <FaCheck className="text-blue-500 text-[8px]" />
                </div>
            ) : isDelivered ? (
                <div className="flex">
                    <FaCheck className="text-gray-500 text-[8px] -mr-1" />
                    <FaCheck className="text-gray-500 text-[8px]" />
                </div>
            ) : (
                <FaCheck className="text-gray-400 text-[8px]" />
            )}
        </div>
    )

    if (loading || userLoading) {
        return <div className="flex items-center justify-center h-screen">
            <div className="w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
    }

    function formatToIST(unixTime) {
        return new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(unixTime * 1000));
    }

    const handleSendMessage = () => {
        if (messageText.trim()) {
            console.log('Sending message:', messageText);
            // TODO: Implement actual message sending logic
            setMessageText(''); // Clear input after sending
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }

    return (
        <div className="bg-[#EDF6F9] w-full h-full pt-8 flex flex-col gap-4">
            {/* Chat Header */}
                            <div className="py-4 px-7 border border-[#d3d1d1] rounded-lg flex items-center justify-between bg-white">
                <div className="flex items-center">
                    <div className=" size-14 rounded-full border-inset border-[4px] border-[#fff] shadow-lg relative">
                        <img
                            src={currentChatUser?.avatar || "/perimg.png"}
                            alt="User Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                        <div className={`absolute bottom-0 right-0 size-4 rounded-full ${currentChatUser?.isOnline ? 'bg-[#4CAF50]' : 'bg-gray-400'} border-2 border-inset border-[#fff]`}></div>
                    </div>
                    <div className=" text-[#212121] ml-4">
                        {userLoading ? (
                            <div className="animate-pulse">
                                <div className="h-5 bg-gray-300 rounded w-24 mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </div>
                        ) : (
                            <>
                                <h5 className=' text-lg font-medium'>{currentChatUser?.name || 'Unknown User'}</h5>
                                <span className=' text-sm font-medium'>{currentChatUser?.isOnline ? 'Online' : 'Offline'}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className=' cursor-pointer' width={25} height={25} viewBox="0 0 24 24"><path fill="#000" d="M18 7c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-3.333L22 17V7l-4 3.333z"></path></svg>

                    <svg xmlns="http://www.w3.org/2000/svg" className=' cursor-pointer' width={25} height={25} viewBox="0 0 48 48"><path fill="#000" d="M22.095 6.894c-.78-1.559-2.41-2.82-4.412-2.597c-1.791.199-4.45.865-6.263 3.049c-1.861 2.243-2.555 5.741-1.126 10.982c1.526 5.591 3.792 11.103 6.609 15.55c2.796 4.415 6.24 7.949 10.191 9.304c3.494 1.198 6.166.698 8.115-.618c1.88-1.269 2.912-3.178 3.446-4.5c.598-1.48.204-3.021-.576-4.157l-2.877-4.184a5.25 5.25 0 0 0-5.892-2.037l-3.976 1.243a.68.68 0 0 1-.723-.187c-1.77-2.073-3.753-4.964-4.292-7.89a.33.33 0 0 1 .033-.23c.585-.983 1.592-2.097 2.593-3.072c1.697-1.652 2.34-4.278 1.22-6.516z"></path></svg>

                    <svg xmlns="http://www.w3.org/2000/svg" className=' cursor-pointer' width={25} height={25} viewBox="0 0 16 16"><path fill="#000" d="M6 9.5A2 2 0 0 1 7.937 11H13.5a.5.5 0 0 1 .09.992L13.5 12l-5.563.001a2 2 0 0 1-3.874 0L2.5 12a.5.5 0 0 1-.09-.992L2.5 11h1.563A2 2 0 0 1 6 9.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2m4-8A2 2 0 0 1 11.937 4H13.5a.5.5 0 0 1 .09.992L13.5 5l-1.563.001a2 2 0 0 1-3.874 0L2.5 5a.5.5 0 0 1-.09-.992L2.5 4h5.563A2 2 0 0 1 10 2.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path></svg>
                </div>
            </div>

            {/* Chat Messages Container */}
                            <div className="flex-1 flex flex-col border border-[#d3d1d1] rounded-lg bg-white">
                {/* Scrollable Messages Area */}
                <div
                    className="flex-1 py-4 px-7 overflow-y-auto scrollbar-hide"
                    ref={chatContainerRef}
                >
                    {/* Show loading or no user data message */}
                    {userLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="w-8 h-8 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-2 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading user data...</p>
                            </div>
                        </div>
                    ) : !currentChatUser ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">User data not available</p>
                        </div>
                    ) : (
                        /* Chat Messages Grouped by Date */
                        [...chatMessages].reverse().map((message) => (
                            <div key={message?.time} className="mb-6">
                                {/* Sticky Date Header for each section */}
                                <div className="sticky top-0 z-20 bg-transparent py-2 mb-4 text-center">
                                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 border border-gray-300">
                                        {formatToIST(message?.time)}
                                    </span>
                                </div>

                                {/* Messages for this date */}
                                <div className="space-y-4">
                                    <div key={message?.id} className={`flex ${message?.position === "right" ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${message?.position === "right" ? 'order-2' : 'order-1'}`}>
                                            <div className={`rounded-lg p-3 ${message?.position === "right"
                                                ? 'bg-[#808080] text-white'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                <p className="text-sm">{message?.text}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs opacity-70">{message.time}</span>
                                                    {message?.position === "right" && (
                                                        <DeliveryStatus isDelivered={message.isDelivered} isRead={message.isRead} />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Profile Photo at Bottom */}
                                            <div className={`flex ${message?.position === "right" ? 'justify-end' : 'justify-start'} mt-1`}>
                                                <img
                                                    src={message?.avatar_full}
                                                    alt="Profile"
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Fixed Input Field at Bottom */}
                <div className='flex px-7 py-4 gap-2 bg-white border-t border-gray-200'>
                    <input 
                        type="text" 
                        placeholder='Type a message' 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className='flex-1 border border-[#d3d1d1] rounded-md p-2 focus:outline-none focus:border-blue-500' 
                    />
                    <button 
                        className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                            messageText.trim() 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                    >
                        <FaPaperPlane className='text-white' size={20} />
                    </button>
                </div>
            </div>


        </div>
    )
}

export default ChatDetailed