import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../utils/constant';
import { FaUserPlus, FaBell, FaComment, FaHeart, FaUserFriends, FaExclamationCircle } from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';
import { HiOutlineTrash } from 'react-icons/hi';

const Notifications = ({ isOpen, onClose, containerRect, refreshCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const accessToken = localStorage.getItem("access_token");

            const response = await fetch(`${baseUrl}/api/v1/notifications/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    seen: 1
                }),
            });

            const data = await response.json();

            if (data?.api_status === 200 && data?.notifications) {
                setNotifications(data.notifications);
            } else {
                setError('Failed to load notifications');
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Error loading notifications');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");

            const response = await fetch(`${baseUrl}/api/v1/notifications/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    seen: 1
                }),
            });

            const data = await response.json();

            if (data?.api_status === 200) {
                // Refresh notifications after marking as read
                fetchNotifications();
                if (refreshCount) refreshCount();
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    // Fetch notifications when component opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications(); // Fetch all notifications
        }
    }, [isOpen]);

    // Get notification icon and color based on type
    const getNotificationUI = (type) => {
        switch (type) {
            case 'admin_notification':
                return { icon: <FaExclamationCircle className="text-white" />, color: 'bg-blue-500' };
            case 'friend_request':
                return { icon: <FaUserFriends className="text-white" />, color: 'bg-green-500' };
            case 'message':
                return { icon: <BiMessageDetail className="text-white" />, color: 'bg-purple-500' };
            case 'like':
                return { icon: <FaHeart className="text-white" />, color: 'bg-red-500' };
            case 'comment':
                return { icon: <FaComment className="text-white" />, color: 'bg-yellow-500' };
            case 'follow':
            case 'following':
                return { icon: <FaUserPlus className="text-white" />, color: 'bg-indigo-500' };
            default:
                return { icon: <FaBell className="text-white" />, color: 'bg-gray-400' };
        }
    };

    // Delete notification
    const deleteNotification = async (notificationId, e) => {
        e.stopPropagation(); // Prevent triggering any parent click handlers
        try {
            const accessToken = localStorage.getItem("access_token");

            const response = await fetch(`${baseUrl}/api/v1/notifications/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    id: notificationId
                }),
            });

            const data = await response.json();

            if (data?.api_status === 200) {
                // Remove notification from local state
                setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
                if (refreshCount) refreshCount();
            } else {
                console.error('Failed to delete notification:', data);
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed top-0 h-screen bg-white z-50 flex flex-col p-6 overflow-y-auto border border-[#d3d1d1] shadow-2xl"
            style={{
                width: containerRect?.width || '100%',
                left: containerRect?.left || 0
            }}
        >
            <div className="flex items-center justify-between border-b border-[#e6e6e6] pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                        disabled={loading || notifications.length === 0}
                    >
                        Mark read
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close notifications"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto space-y-3 pr-1">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-2 border-blue-500 rounded-full animate-spin"></div>
                        <p className="ml-3 text-gray-500">Loading notifications...</p>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : notifications && notifications.length > 0 ? (
                    notifications.map((notification) => {
                        const { icon, color } = getNotificationUI(notification.type);
                        return (
                            <div
                                key={notification.id}
                                className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${notification.seen === 0
                                    ? 'border-blue-100 bg-blue-50/30 hover:bg-blue-50/50'
                                    : 'border-gray-100 bg-white hover:border-gray-200'
                                    }`}
                            >
                                {/* Notifier avatar with type icon badge */}
                                <div className="relative flex-shrink-0">
                                    {notification.notifier?.avatar_url ? (
                                        <img
                                            src={notification.notifier.avatar_url}
                                            alt={notification.notifier.name || 'User'}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                            onError={(e) => {
                                                e.target.src = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-white shadow-sm">
                                            <FaBell className="w-6 h-6 text-gray-400" />
                                        </div>
                                    )}
                                    <div className={`absolute -right-1 -bottom-1 w-5 h-5 rounded-full ${color} flex items-center justify-center border-2 border-white shadow-sm`}>
                                        <span className="text-[10px]">{icon}</span>
                                    </div>
                                </div>

                                {/* Notification content */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <div className="flex justify-between items-start">
                                        <p className={`text-sm ${notification.seen === 0 ? 'font-bold' : 'font-medium'} text-gray-900 leading-tight`}>
                                            <span className="hover:text-blue-600 transition-colors cursor-pointer">
                                                {notification.notifier?.name || notification.notifier?.username || 'Someone'}
                                            </span>
                                            {" "}
                                            <span className="text-gray-600 font-normal">
                                                {notification.type_text || 'performed an action'}
                                            </span>
                                            {notification.text && (
                                                <span className="block mt-1 text-gray-800 font-normal italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                                                    "{notification.text}"
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${notification.seen === 0 ? 'bg-blue-500 animate-pulse' : 'bg-transparent'}`}></span>
                                        {notification.time_text_string || notification.time_text || 'Just now'}
                                    </p>
                                </div>

                                {/* Delete button - visible on group hover or always mobile */}
                                <button
                                    onClick={(e) => deleteNotification(notification.id, e)}
                                    className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    aria-label="Delete notification"
                                >
                                    <HiOutlineTrash className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-gray-500">No notifications found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;

