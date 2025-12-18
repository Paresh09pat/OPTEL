import React, { useEffect, useState } from 'react';
import { baseUrl } from '../../utils/constant';

const Notifications = ({ isOpen, onClose, containerRect }) => {
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

    // Get notification indicator color based on type
    const getNotificationColor = (type) => {
        const colorMap = {
            'admin_notification': 'bg-blue-500',
            'friend_request': 'bg-green-500',
            'message': 'bg-purple-500',
            'like': 'bg-red-500',
            'comment': 'bg-yellow-500',
            'follow': 'bg-indigo-500',
        };
        return colorMap[type] || 'bg-gray-400';
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
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${notification.seen === 0
                                    ? 'border-[#EEF2F7] hover:border-blue-100 hover:bg-blue-50/40 bg-blue-50/20'
                                    : 'border-[#EEF2F7] hover:border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {/* Notification indicator */}
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getNotificationColor(notification.type)} ${notification.seen === 0 ? 'opacity-100' : 'opacity-50'}`}></div>

                            {/* Notifier avatar */}
                            <div className="flex-shrink-0">
                                {notification.notifier?.avatar_url ? (
                                    <img
                                        src={notification.notifier.avatar_url}
                                        alt={notification.notifier.name || 'User'}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
                                        }}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Notification content */}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm ${notification.seen === 0 ? 'font-semibold' : 'font-medium'} text-gray-800`}>
                                    {notification.text || notification.type_text}
                                </p>
                                {notification.type_text && notification.text && (
                                    <p className="text-xs text-gray-600 mt-1">{notification.type_text}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    {notification.time_text_string || notification.time_text || 'Just now'}
                                </p>
                            </div>

                            {/* Delete button */}
                            <button
                                onClick={(e) => deleteNotification(notification.id, e)}
                                className="flex-shrink-0 p-1 rounded-full hover:bg-red-50 transition-colors group"
                                aria-label="Delete notification"
                            >
                                <svg 
                                    className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))
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

