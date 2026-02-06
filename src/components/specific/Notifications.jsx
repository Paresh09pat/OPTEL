import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../utils/constant';
import { FaUserPlus, FaBell, FaComment, FaHeart, FaUserFriends, FaExclamationCircle } from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';
import { HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Notifications = ({ isOpen, onClose, containerRect, refreshCount }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                    seen: 0 // Fetch all notifications (both seen and unseen)
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

    // Mark all notifications as seen
    const markAllAsRead = async () => {
        try {
            const accessToken = localStorage.getItem("access_token");

            const response = await fetch(`${baseUrl}/api/v1/notifications/mark-all-seen`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Requested-With': 'XMLHttpRequest',
                    "Accept": "application/json"
                },
                body: JSON.stringify({}),
            });

            const data = await response.json();
            console.log('Mark all as seen response:', data);

            if (data?.api_status === 200 || data?.ok === true) {
                // Update local state to mark all as seen
                setNotifications(prev => prev.map(notif => ({ ...notif, seen: 1 })));
                // Refresh count in parent
                if (refreshCount) refreshCount();
                // Show success toast
                toast.success(data?.message || data?.message_data || 'All notifications marked as seen');
            } else {
                console.error('Failed to mark as seen:', data);
                toast.error(data?.message || data?.message_data || 'Failed to mark notifications as seen');
            }
        } catch (error) {
            console.error('Error marking notifications as seen:', error);
            toast.error('Failed to mark notifications as seen');
        }
    };

    // Fetch notifications when component opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications(); // Fetch all notifications
            // Also refresh the count when opening
            if (refreshCount) refreshCount();
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

    // Handle notification click - navigate to profile or post
    const handleNotificationClick = async (notification) => {
        try {
            // Update local state to mark as seen immediately (use current timestamp)
            const currentTimestamp = Math.floor(Date.now() / 1000);
            setNotifications(prev => prev.map(notif => 
                notif.id === notification.id ? { ...notif, seen: currentTimestamp } : notif
            ));

            // Refresh count
            if (refreshCount) refreshCount();

            // Navigate based on notification type
            if (notification.type === 'following' || notification.type === 'follow_request' || notification.type === 'follow') {
                // For follow-related notifications, navigate to the notifier's profile
                if (notification.notifier_id) {
                    navigate(`/profile/${notification.notifier_id}`);
                    onClose();
                }
            } else if (notification.post_id) {
                // For post-related notifications, navigate to post detail
                navigate(`/post/${notification.post_id}`);
                onClose();
            } else if (notification.url) {
                // Use the URL provided by the API for other types
                const path = notification.url.replace('index.php?link1=', '/').replace('&u=', '/');
                navigate(path);
                onClose();
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
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
                // Refresh count in parent
                if (refreshCount) refreshCount();
                // Show success toast
                toast.success(data?.message_data || data?.message || 'Notification deleted successfully');
            } else {
                toast.error(data?.message_data || data?.message || 'Failed to delete notification');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
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
                        const isUnread = notification.seen === 0; // seen is 0 for unread, timestamp for read
                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`group flex items-start gap-3 p-4 rounded-2xl border transition-all duration-300 hover:shadow-md cursor-pointer ${isUnread
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
                                        <p className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'} text-gray-900 leading-tight`}>
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
                                        <span className={`w-1.5 h-1.5 rounded-full ${isUnread ? 'bg-blue-500 animate-pulse' : 'bg-transparent'}`}></span>
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

