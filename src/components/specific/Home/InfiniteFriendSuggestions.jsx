import { useState, useEffect, useRef, useCallback, memo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const InfiniteFriendSuggestions = ({ friendSuggestions, onAddFriend, followedUsers }) => {
    const [displayedFriends, setDisplayedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestedUsers, setRequestedUsers] = useState(new Set());
    const [loadingUsers, setLoadingUsers] = useState(new Set());
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const scrollCheckRef = useRef(null);
    const isLoadingRef = useRef(false);

    // Fetch friend suggestions from API
    useEffect(() => {
        const fetchFriendSuggestions = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const accessToken = localStorage.getItem('access_token');
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/friends/suggested?limit=12`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken || ''}`,
                        }
                    }
                );

                if (response.data?.api_status === 200 && response.data?.suggestions) {
                    // Map API response to expected format
                    const mappedSuggestions = response.data.suggestions.map(suggestion => ({
                        id: suggestion.user_id,
                        user_id: suggestion.user_id,
                        name: suggestion.name,
                        username: suggestion.username,
                        avatar: suggestion.avatar,
                        avatar_url: suggestion.avatar_url,
                        is_following: suggestion.is_following,
                        is_friend: suggestion.is_friend
                    }));
                    
                    setDisplayedFriends(mappedSuggestions);
                } else {
                    throw new Error('Invalid API response');
                }
            } catch (err) {
                console.error('Error fetching friend suggestions:', err);
                setError('Failed to load friend suggestions');
                // Fallback to prop data if available
                if (friendSuggestions && friendSuggestions.length > 0) {
                    setDisplayedFriends([...friendSuggestions]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFriendSuggestions();
    }, []); // Only run on mount

    // Handle friend request
    const handleSendFriendRequest = useCallback(async (userId) => {
        // Set loading state for this user
        setLoadingUsers(prev => {
            const newSet = new Set(prev);
            newSet.add(userId);
            return newSet;
        });

        try {
            const accessToken = localStorage.getItem('access_token');
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/friends/send-request`,
                { user_id: userId.toString() },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken || ''}`,
                    }
                }
            );

            if (response.data?.api_status === 200) {
                // Update local state to mark user as requested
                setRequestedUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.add(userId);
                    return newSet;
                });
                
                // Also update displayedFriends to reflect the change
                setDisplayedFriends(prev => 
                    prev.map(friend => 
                        friend.id === userId || friend.user_id === userId
                            ? { ...friend, is_following: true }
                            : friend
                    )
                );

                // Show success message
                const successMessage = response.data?.follow_status === 'followed' 
                    ? 'Friend request sent successfully!' 
                    : response.data?.message || 'Friend request sent successfully!';
                toast.success(successMessage);
                
                // Call the original onAddFriend if provided (for parent component state updates)
                if (onAddFriend) {
                    onAddFriend(userId);
                }
            } else {
                throw new Error(response.data?.message || 'Failed to send friend request');
            }
        } catch (err) {
            console.error('Error sending friend request:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send friend request';
            toast.error(errorMessage);
        } finally {
            // Clear loading state for this user
            setLoadingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    }, [onAddFriend]);

    // Throttled scroll check function
    const checkScrollButtons = useCallback(() => {
        if (scrollCheckRef.current) {
            cancelAnimationFrame(scrollCheckRef.current);
        }

        scrollCheckRef.current = requestAnimationFrame(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
            }
        });
    }, []);

    useEffect(() => {
        checkScrollButtons();
        const handleResize = () => checkScrollButtons();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (scrollCheckRef.current) {
                cancelAnimationFrame(scrollCheckRef.current);
            }
        };
    }, [displayedFriends, checkScrollButtons]);

    const scrollLeft = useCallback(() => {
        if (scrollRef.current) {
            const cardWidth = 176; // 160px + 16px gap
            scrollRef.current.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                setTimeout(checkScrollButtons, 300);
            });
        }
    }, [checkScrollButtons]);

    const scrollRight = useCallback(() => {
        if (scrollRef.current) {
            const cardWidth = 176; // 160px + 16px gap
            scrollRef.current.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });

            // Load more friends when near the end (throttled)
            if (!isLoadingRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 500) {
                    isLoadingRef.current = true;
                    requestAnimationFrame(() => {
                        // Duplicate current friends for infinite scroll effect
                        setDisplayedFriends(prev => [...prev, ...prev]);
                        setTimeout(() => {
                            isLoadingRef.current = false;
                        }, 300);
                    });
                }
            }

            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                setTimeout(checkScrollButtons, 300);
            });
        }
    }, [checkScrollButtons]);

    // Throttled scroll handler
    const handleScroll = useCallback(() => {
        checkScrollButtons();
    }, [checkScrollButtons]);

    return (
        <div className="relative group stable-layout">
            {/* Left Arrow - Desktop only */}
            <button
                onClick={scrollLeft}
                className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center transition-all duration-200 hover:shadow-xl hidden md:flex group-hover:opacity-100 will-change-transform ${canScrollLeft ? 'opacity-70 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                    }`}
                disabled={!canScrollLeft}
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Arrow - Desktop only */}
            <button
                onClick={scrollRight}
                className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center transition-all duration-200 hover:shadow-xl hidden md:flex group-hover:opacity-100 will-change-transform ${canScrollRight ? 'opacity-70 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                    }`}
                disabled={!canScrollRight}
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide smooth-scroll pb-2 px-2 md:px-12"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch' // Better touch scrolling on mobile
                }}
                onScroll={handleScroll}
            >
                {loading ? (
                    <div className="flex items-center justify-center min-w-full py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-sm">Loading friend suggestions...</p>
                        </div>
                    </div>
                ) : error && displayedFriends.length === 0 ? (
                    <div className="flex items-center justify-center min-w-full py-8">
                        <p className="text-gray-600 text-sm">{error}</p>
                    </div>
                ) : displayedFriends.length > 0 ? (
                    displayedFriends.map((friend, index) => (
                        <FriendSuggestionCard
                            key={`${friend.id}-${index}`}
                            user={friend}
                            onAddFriend={() => handleSendFriendRequest(friend.id || friend.user_id)}
                            followedUsers={followedUsers}
                            requestedUsers={requestedUsers}
                            loadingUsers={loadingUsers}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center min-w-full py-8">
                        <p className="text-gray-600 text-sm">No friend suggestions available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(InfiniteFriendSuggestions);


const FriendSuggestionCard = ({ user, onAddFriend, followedUsers, requestedUsers, loadingUsers }) => {
    const userId = user.id || user.user_id;
    const isFollowed = followedUsers.has(userId);
    const isRequested = requestedUsers.has(userId) || user.is_following === true;
    const isLoading = loadingUsers.has(userId);
    const isDisabled = isFollowed || isRequested || isLoading;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#d3d1d1] overflow-hidden min-w-[150px] max-w-[150px] md:min-w-[160px] md:max-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow duration-200">
            <div className="relative flex items-center justify-center">
                <img
                    src={user?.avatar_url || user?.avatar || '/user.png'}
                    alt={user.name}
                    className="w-[90%] max-auto h-20 md:h-34"
                    onError={(e) => {
                        e.target.src = '/user.png';
                    }}
                />
            </div>
            <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-900 text-xs md:text-sm mb-1 truncate">{user.name}</h3>
                <p className="text-xs text-gray-500 mb-3 truncate">{user.username}</p>
                <button
                    onClick={!isDisabled ? onAddFriend : undefined}
                    disabled={isDisabled}
                    className={`px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm w-full font-medium transition-colors flex items-center justify-center gap-2
                 ${isDisabled
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                            <span>Sending...</span>
                        </>
                    ) : isFollowed || isRequested ? (
                        "Requested"
                    ) : (
                        "Add Friend"
                    )}
                </button>
            </div>
        </div>
    );
}