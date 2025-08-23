import React, { useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

const ChatDetailed = () => {
    const { chatId } = useParams();
    console.log(chatId, 'chatId');
    const chatContainerRef = useRef(null)
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(false);
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
        getchatmessages();
    }, [chatId]);
    console.log(chatMessages, 'chatMessages-detailed');
    // Sample chat messages with different dates
    const chatMessagess = [
        // Yesterday's messages
        {
            id: 1,
            text: "Hey! How's the project going?",
            time_text: "10:30 AM",
            date: "December 13, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 2,
            text: "It's going great! Just finished the UI mockups.",
            time: "10:32 AM",
            date: "December 13, 2024",
            isMe: true,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 3,
            text: "Awesome! Can you send them over?",
            time: "10:33 AM",
            date: "December 13, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 4,
            text: "Sure! I'll send them in a few minutes.",
            time: "10:35 AM",
            date: "December 13, 2024",
            isMe: true,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },

        // Day before yesterday's messages
        {
            id: 5,
            text: "Good morning! Ready for today's meeting?",
            time: "9:15 AM",
            date: "December 14, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 6,
            text: "Yes! I've prepared all the documents we need.",
            time: "9:18 AM",
            date: "December 14, 2024",
            isMe: true,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 7,
            text: "Perfect! The client will be impressed.",
            time: "9:20 AM",
            date: "December 14, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 8,
            text: "Meeting went great! Thanks for your help.",
            time: "2:45 PM",
            date: "December 14, 2024",
            isMe: true,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 9,
            text: "Anytime! We make a great team.",
            time: "2:47 PM",
            date: "December 14, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },

        // Today's messages
        {
            id: 10,
            text: "Hey! How was your weekend?",
            time: "8:30 AM",
            date: "December 15, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 11,
            text: "It was amazing! Went hiking with friends.",
            time: "8:35 AM",
            date: "December 15, 2024",
            isMe: true,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 12,
            text: "That sounds fun! I spent time with family.",
            time: "8:37 AM",
            date: "December 15, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 13,
            text: "Here are the mockups I've been working on. Let me know what you think!",
            time: "10:40 AM",
            date: "December 15, 2024",
            isMe: true,
            isDelivered: true,
            isRead: false,
            avatar: "/perimg.png"
        },
        {
            id: 14,
            text: "These look amazing! Great work on the color scheme.",
            time: "10:42 AM",
            date: "December 15, 2024",
            isMe: false,
            isDelivered: true,
            isRead: true,
            avatar: "/perimg.png"
        },
        {
            id: 15,
            text: "Thanks! I'm really happy with how it turned out.",
            time: "10:43 AM",
            date: "December 15, 2024",
            isMe: true,
            isDelivered: false,
            isRead: false,
            avatar: "/perimg.png"
        }
    ]

    // Group messages by date
    // const groupedMessages = chatMessagess.reduce((groups, message) => {
    //     const date = message.date
    //     if (!groups[date]) {
    //         groups[date] = []
    //     }
    //     groups[date].push(message)
    //     return groups
    // }, {})

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

    if (loading) {
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

    return (
        <div className="bg-[#EDF6F9] w-full h-full pt-8 flex flex-col gap-4">
            {/* Chat Header */}
            <div className="py-4 px-7 border border-[#808080] rounded-lg flex items-center justify-between bg-white">
                <div className="flex items-center">
                    <div className=" size-14 rounded-full border-inset border-[4px] border-[#fff] shadow-lg relative">
                        <img src="/perimg.png" alt="User Profile" className="w-full h-full rounded-full object-cover" />
                        <div className="absolute bottom-0 right-0 size-4 rounded-full bg-[#4CAF50] border-2 border-inset border-[#fff]"></div>
                    </div>
                    <div className=" text-[#212121] ml-4">
                        <h5 className=' text-lg font-medium'>Sana Rizvi</h5>
                        <span className=' text-sm font-medium'>Now</span>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className=' cursor-pointer' width={25} height={25} viewBox="0 0 24 24"><path fill="#000" d="M18 7c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-3.333L22 17V7l-4 3.333z"></path></svg>

                    <svg xmlns="http://www.w3.org/2000/svg" className=' cursor-pointer' width={25} height={25} viewBox="0 0 48 48"><path fill="#000" d="M22.095 6.894c-.78-1.559-2.41-2.82-4.412-2.597c-1.791.199-4.45.865-6.263 3.049c-1.861 2.243-2.555 5.741-1.126 10.982c1.526 5.591 3.792 11.103 6.609 15.55c2.796 4.415 6.24 7.949 10.191 9.304c3.494 1.198 6.166.698 8.115-.618c1.88-1.269 2.912-3.178 3.446-4.5c.598-1.48.204-3.021-.576-4.157l-2.877-4.184a5.25 5.25 0 0 0-5.892-2.037l-3.976 1.243a.68.68 0 0 1-.723-.187c-1.77-2.073-3.753-4.964-4.292-7.89a.33.33 0 0 1 .033-.23c.585-.983 1.592-2.097 2.593-3.072c1.697-1.652 2.34-4.278 1.22-6.516z"></path></svg>

                    <svg xmlns="http://www.w3.org/2000/svg" className=' cursor-pointer' width={25} height={25} viewBox="0 0 16 16"><path fill="#000" d="M6 9.5A2 2 0 0 1 7.937 11H13.5a.5.5 0 0 1 .09.992L13.5 12l-5.563.001a2 2 0 0 1-3.874 0L2.5 12a.5.5 0 0 1-.09-.992L2.5 11h1.563A2 2 0 0 1 6 9.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2m4-8A2 2 0 0 1 11.937 4H13.5a.5.5 0 0 1 .09.992L13.5 5l-1.563.001a2 2 0 0 1-3.874 0L2.5 5a.5.5 0 0 1-.09-.992L2.5 4h5.563A2 2 0 0 1 10 2.5m0 1a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path></svg>
                </div>
            </div>

            {/* Chat Messages Container */}
            <div
                className="flex-1 py-4 px-7 border border-[#808080] rounded-lg bg-white overflow-y-auto scrollbar-hide relative"
                ref={chatContainerRef}
            >
                {/* Chat Messages Grouped by Date */}
                {[...chatMessages].reverse().map((message) => (
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
                ))}
            </div>
        </div>
    )
}

export default ChatDetailed