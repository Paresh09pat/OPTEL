import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { LiaEdit } from 'react-icons/lia'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Avatar from '../components/Avatar'
import ConfirmModal from '../components/ConfirmModal'
import Loader from '../components/loading/Loader'
import CreatePostSection from '../components/specific/Home/CreatePostSection'
import PostCard from '../components/specific/Home/PostCard'
import QuickActionSection from '../components/specific/Home/QuickActionSection'
import FollowersFollowingModal from '../components/specific/Profile/FollowersFollowingModal'

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'followers', 'following', or 'posts'
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerTarget = useRef(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [friendStatus, setFriendStatus] = useState({
        is_friend: false,
        friend_request_sent: false,
        friend_request_received: false,
        can_follow: true
    });
    const [isFriendLoading, setIsFriendLoading] = useState(false);
    const [showUnfriendModal, setShowUnfriendModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [isBlockLoading, setIsBlockLoading] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [badgeInfo, setBadgeInfo] = useState(null);
    const [badgeLoading, setBadgeLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendsLoading, setFriendsLoading] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false); // Track scroll position for scroll-to-top button
    const navigate = useNavigate();
    const { userId: urlUserId } = useParams();

    // Get user ID from URL params, or fallback to localStorage, or default
    const userId = urlUserId || localStorage.getItem('user_id') || '222102';
    const currentUserId = localStorage.getItem('user_id');
    const isOwnProfile = !urlUserId || urlUserId === currentUserId;

    // Fetch badge information
    const fetchBadgeInfo = async (targetUserId) => {
        try {
            setBadgeLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/users/${targetUserId}/badge`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );

            const data = response.data;
            if (data.api_status === 200 && data.data) {
                setBadgeInfo(data.data);
            }
        } catch (err) {
            console.error('Error fetching badge info:', err);
        } finally {
            setBadgeLoading(false);
        }
    };

    // Fetch friends list
    const fetchFriends = async () => {
        try {
            setFriendsLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/friends?type=all&per_page=12`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );

            const data = response.data;
            if (data.ok === true && data.data) {
                setFriends(data.data.friends || []);
            }
        } catch (err) {
            console.error('Error fetching friends:', err);
        } finally {
            setFriendsLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                    const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );

                const data = response.data;
                
                if (data.api_status === '200') {
                    setUserData(data);
                    
                    if (data.user_data?.avatar_url) {
                        localStorage.setItem('user_avatar_url', data.user_data.avatar_url);
                    }
                    if (data.user_data?.first_name) {
                        localStorage.setItem('user_first_name', data.user_data.first_name);
                    }
                    if (data.user_data?.last_name) {
                        localStorage.setItem('user_last_name', data.user_data.last_name);
                    }
                    if (data.user_data?.username) {
                        localStorage.setItem('user_username', data.user_data.username);
                    }
                    // Update follow status based on is_following from API response
                    setIsFollowing(data.user_data?.is_following === 1 && !isOwnProfile);
                    // Update blocked status
                    setIsBlocked(data.user_data?.is_blocked === 1 || data.user_data?.is_blocked === true);
                    // Update friend status based on all friend-related fields from API response
                    setFriendStatus({
                        is_friend: data.user_data?.is_friend === 1 || data.user_data?.is_friend === true,
                        friend_request_sent: data.user_data?.friend_request_sent === 1 || data.user_data?.friend_request_sent === true,
                        friend_request_received: data.user_data?.friend_request_received === 1 || data.user_data?.friend_request_received === true,
                        can_follow: data.user_data?.can_follow === 1 || data.user_data?.can_follow === true
                    });
                    
                    // Fetch badge information
                    fetchBadgeInfo(userId);
                    
                    // Fetch friends list (only for own profile)
                    if (isOwnProfile) {
                        fetchFriends();
                    }
                } else {
                    throw new Error(data.api_text || 'Failed to fetch user data');
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.message);
                // Set fallback data to maintain UI
                setUserData({
                    user_data: {
                        first_name: 'Aman',
                        last_name: 'Shaikh',
                        username: 'aman.shaikh',
                        avatar_url: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1760035094~exp=1760038694~hmac=cb0279b1f187ff0765dcec9bf94f6b16820a37f80310b7c88a47f91409234f8d&w=1480',
                        cover_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                        post_count: 100,
                        followers_number: 433,
                        following_number: 403
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    // Scroll to top functionality - tracks the main scrollable container
    useEffect(() => {
        // Find the main scrollable container (the <main> element in MainLayout)
        const mainContainer = document.querySelector('main.overflow-y-auto');
        
        if (!mainContainer) return;

        const handleScroll = () => {
            // Show button when scrolled more than 100vh in the main container
            const scrolled = mainContainer.scrollTop;
            const viewportHeight = window.innerHeight;
            setShowScrollTop(scrolled > viewportHeight);
        };

        mainContainer.addEventListener('scroll', handleScroll);
        return () => mainContainer.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        // Scroll the main container, not the window
        const mainContainer = document.querySelector('main.overflow-y-auto');
        if (mainContainer) {
            mainContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // Add state for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);

    // Infinite scroll effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Check if the target is intersecting and we have more posts to load
                if (entries[0].isIntersecting && hasMorePosts && !postsLoading && !isLoadingMore) {
                   
                    setCurrentPage(prev => prev + 1);
                }
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '100px' // Start loading 100px before reaching the element
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMorePosts, postsLoading, isLoadingMore]);

    // Fetch user posts using timeline API for all profiles
    useEffect(() => {
        const fetchUserPosts = async (page = 1) => {
            try {
                // Use different loading state for pagination vs initial load
                if (page === 1) {
                    setPostsLoading(true);
                } else {
                    setIsLoadingMore(true);
                }
                
                // Get username from userData - works for both own profile and other users
                const username = userData?.user_data?.username;
                
                if (!username) {
                    console.error('Username not available');
                    setPosts([]);
                    setPostsLoading(false);
                    setIsLoadingMore(false);
                    return;
                }

                // Use timeline API for all profiles (own and others)
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/timeline?u=${username}&limit=20&page=${page}`,
                    {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem('access_token'),
                            "Content-Type": "application/json",
                        }
                    }
                );
                
                const data = response.data;
                
                if (data.api_status === '200' && Array.isArray(data.posts)) {
                    // Map timeline API response to PostCard format
                    const formattedPosts = data.posts.map(post => {
                        // Get user info from post.user or fallback to userData
                        const postUser = post.user || {
                            user_id: post.user_id || userData.user_data.user_id,
                            username: post.username || username,
                            name: post.name || `${userData.user_data.first_name || ''} ${userData.user_data.last_name || ''}`.trim() || userData.user_data.name,
                            avatar_url: post.avatar_url || post.avatar || userData.user_data.avatar_url
                        };

                        return {
                            id: post.id || post.post_id,
                            author: postUser,
                            post_text: post.postText || post.post_text || post.text || '',
                            post_type: post.postType || post.post_type,
                            poll_id: post.poll_id,
                            poll_options: post.poll_options,
                            reactions_count: post.reactions_count || post.likes_count || 0,
                            comments_count: post.comments_count || 0,
                            shares_count: post.shares_count || 0,
                            is_liked: post.is_liked || false,
                            is_post_saved: post.is_post_saved || false,
                            created_at_human: post.created_at_human || post.time_ago || (post.time ? new Date(post.time * 1000).toLocaleString() : 'Unknown'),
                            created_at: post.created_at || (post.time ? new Date(post.time * 1000).toISOString() : null),
                            post_photo_url: post.post_photo_url || (post.postPhoto && post.postPhoto !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postPhoto}` : null),
                            post_file_url: post.post_file_url || (post.postFile && post.postFile !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postFile}` : null),
                            post_video_url: post.post_video_url || (post.postVideo && post.postVideo !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postVideo}` : null),
                            post_file: post.post_file || post.postFile,
                            postFileName: post.postFileName,
                            post_youtube: post.post_youtube || post.postYoutube,
                            album_images: post.album_images,
                            multi_image_post: post.multi_image_post,
                            reaction_counts: post.reaction_counts,
                            user_reaction: post.user_reaction,
                            current_reaction: post.current_reaction,
                            blog: post.blog
                        };
                    });
                    
                    // Handle pagination
                    if (page === 1) {
                        setPosts(formattedPosts);
                    } else {
                        setPosts(prev => [...prev, ...formattedPosts]);
                    }
                    
                    // Update pagination state
                    if (data.pagination) {
                        setHasMorePosts(data.pagination.has_more || data.pagination.current_page < data.pagination.last_page);
                        setTotalPosts(data.pagination.total || 0);
                        setCurrentPage(data.pagination.current_page || page);
                    } else {
                        setHasMorePosts(false);
                        setTotalPosts(formattedPosts.length);
                    }
                } else {
                    setPosts([]);
                    setHasMorePosts(false);
                    setTotalPosts(0);
                }
            } catch (err) {
                console.error('Error fetching user posts:', err);
                setPosts([]);
                setHasMorePosts(false);
                setTotalPosts(0);
            } finally {
                setPostsLoading(false);
                setIsLoadingMore(false);
            }
        };

        if (userData?.user_data?.username) {
            fetchUserPosts(currentPage);
        }
    }, [userData, currentPage]);

    const handleEditProfile = () => {
        navigate('/profile-settings');
    };

    const handleFollow = async () => {
        if (isOwnProfile || userData?.user_data?.is_following) return;
        
        setIsFollowLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/people-follow/follow`,
                {
                    user_id: userId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful follow response
            if (data?.api_status === 200 && data?.follow_status === "followed") {
                setIsFollowing(true);
                toast.success('Successfully followed user!');
                // Refresh user data to get updated counts and follow status
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );
                if (refreshResponse.data.api_status === '200') {
                    setUserData(refreshResponse.data);
                    // Update follow status after refresh using is_following
                    setIsFollowing(refreshResponse.data.user_data?.is_following === 1 && !isOwnProfile);
                    // Update friend status after refresh
                    setFriendStatus({
                        is_friend: refreshResponse.data.user_data?.is_friend === 1 || refreshResponse.data.user_data?.is_friend === true,
                        friend_request_sent: refreshResponse.data.user_data?.friend_request_sent === 1 || refreshResponse.data.user_data?.friend_request_sent === true,
                        friend_request_received: refreshResponse.data.user_data?.friend_request_received === 1 || refreshResponse.data.user_data?.friend_request_received === true,
                        can_follow: refreshResponse.data.user_data?.can_follow === 1 || refreshResponse.data.user_data?.can_follow === true
                    });
                }
            } else {
                // Handle error response
                toast.error(data?.message || 'Failed to follow user. Please try again.');
            }
        } catch (error) {
            console.error('Error following user:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to follow user. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleUnfollow = async () => {
        if (isOwnProfile || !userData?.user_data?.is_following) return;
        
        setIsFollowLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/users/${userId}/follow`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful unfollow response
            if (data?.ok === true && data?.data?.status === "unfollowed") {
                setIsFollowing(false);
                toast.success(data?.message || 'Successfully unfollowed user!');
                // Refresh user data to get updated counts and follow status
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );
                if (refreshResponse.data.api_status === '200') {
                    setUserData(refreshResponse.data);
                    // Update follow status after refresh using is_following
                    setIsFollowing(refreshResponse.data.user_data?.is_following === 1 && !isOwnProfile);
                    // Update friend status after refresh
                    setFriendStatus({
                        is_friend: refreshResponse.data.user_data?.is_friend === 1 || refreshResponse.data.user_data?.is_friend === true,
                        friend_request_sent: refreshResponse.data.user_data?.friend_request_sent === 1 || refreshResponse.data.user_data?.friend_request_sent === true,
                        friend_request_received: refreshResponse.data.user_data?.friend_request_received === 1 || refreshResponse.data.user_data?.friend_request_received === true,
                        can_follow: refreshResponse.data.user_data?.can_follow === 1 || refreshResponse.data.user_data?.can_follow === true
                    });
                }
            } else {
                // Handle error response
                toast.error(data?.message || 'Failed to unfollow user. Please try again.');
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to unfollow user. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleSendFriendRequest = async () => {
        if (isOwnProfile || friendStatus.is_friend || friendStatus.friend_request_sent) return;
        
        setIsFriendLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/friends/send-request`,
                {
                    user_id: userId.toString()
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful friend request response
            if (data?.api_status === 200) {
                setFriendStatus(prev => ({ ...prev, friend_request_sent: true }));
                toast.success(data?.message || 'Friend request sent successfully!');
                // Refresh user data to get updated friend status
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );
                if (refreshResponse.data.api_status === '200') {
                    setUserData(refreshResponse.data);
                    // Update friend status after refresh
                    setFriendStatus({
                        is_friend: refreshResponse.data.user_data?.is_friend === 1 || refreshResponse.data.user_data?.is_friend === true,
                        friend_request_sent: refreshResponse.data.user_data?.friend_request_sent === 1 || refreshResponse.data.user_data?.friend_request_sent === true,
                        friend_request_received: refreshResponse.data.user_data?.friend_request_received === 1 || refreshResponse.data.user_data?.friend_request_received === true,
                        can_follow: refreshResponse.data.user_data?.can_follow === 1 || refreshResponse.data.user_data?.can_follow === true
                    });
                }
            } else {
                // Handle error response
                toast.error(data?.message || 'Failed to send friend request. Please try again.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to send friend request. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsFriendLoading(false);
        }
    };

    const handleAcceptFriendRequest = async () => {
        if (isOwnProfile || !friendStatus.friend_request_received) return;
        
        setIsFriendLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/friends/accept-request`,
                {
                    user_id: userId.toString()
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful accept response
            if (data?.api_status === 200 || data?.ok === true) {
                setFriendStatus(prev => ({ ...prev, is_friend: true, friend_request_received: false }));
                toast.success(data?.message || 'Friend request accepted!');
                // Refresh user data
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );
                if (refreshResponse.data.api_status === '200') {
                    setUserData(refreshResponse.data);
                    setFriendStatus({
                        is_friend: refreshResponse.data.user_data?.is_friend === 1 || refreshResponse.data.user_data?.is_friend === true,
                        friend_request_sent: refreshResponse.data.user_data?.friend_request_sent === 1 || refreshResponse.data.user_data?.friend_request_sent === true,
                        friend_request_received: refreshResponse.data.user_data?.friend_request_received === 1 || refreshResponse.data.user_data?.friend_request_received === true,
                        can_follow: refreshResponse.data.user_data?.can_follow === 1 || refreshResponse.data.user_data?.can_follow === true
                    });
                }
            } else {
                toast.error(data?.message || 'Failed to accept friend request. Please try again.');
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to accept friend request. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsFriendLoading(false);
        }
    };

    const handleCancelFriendRequest = async () => {
        if (isOwnProfile || !friendStatus.friend_request_sent) return;
        
        setIsFriendLoading(true);
        try {
            // Use the same send-request API - it will cancel if already sent
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/friends/send-request`,
                {
                    user_id: userId.toString()
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful cancel response
            if (data?.api_status === 200) {
                setFriendStatus(prev => ({ ...prev, friend_request_sent: false }));
                toast.success(data?.message || 'Friend request cancelled!');
                // Refresh user data
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );
                if (refreshResponse.data.api_status === '200') {
                    setUserData(refreshResponse.data);
                    setFriendStatus({
                        is_friend: refreshResponse.data.user_data?.is_friend === 1 || refreshResponse.data.user_data?.is_friend === true,
                        friend_request_sent: refreshResponse.data.user_data?.friend_request_sent === 1 || refreshResponse.data.user_data?.friend_request_sent === true,
                        friend_request_received: refreshResponse.data.user_data?.friend_request_received === 1 || refreshResponse.data.user_data?.friend_request_received === true,
                        can_follow: refreshResponse.data.user_data?.can_follow === 1 || refreshResponse.data.user_data?.can_follow === true
                    });
                }
            } else {
                toast.error(data?.message || 'Failed to cancel friend request. Please try again.');
            }
        } catch (error) {
            console.error('Error cancelling friend request:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel friend request. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsFriendLoading(false);
        }
    };

    const handleUnfriendClick = () => {
        setShowUnfriendModal(true);
    };

    const handleUnfriend = async () => {
        if (isOwnProfile || !friendStatus.is_friend) return;
        
        setIsFriendLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/v1/friends/${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful unfriend response
            if (data?.ok === true || data?.api_status === 200) {
                setFriendStatus(prev => ({ ...prev, is_friend: false }));
                setShowUnfriendModal(false);
                toast.success(data?.message || 'Successfully unfriended user!');
                // Refresh user data to get updated friend status
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );
                if (refreshResponse.data.api_status === '200') {
                    setUserData(refreshResponse.data);
                    // Update friend status after refresh
                    setFriendStatus({
                        is_friend: refreshResponse.data.user_data?.is_friend === 1 || refreshResponse.data.user_data?.is_friend === true,
                        friend_request_sent: refreshResponse.data.user_data?.friend_request_sent === 1 || refreshResponse.data.user_data?.friend_request_sent === true,
                        friend_request_received: refreshResponse.data.user_data?.friend_request_received === 1 || refreshResponse.data.user_data?.friend_request_received === true,
                        can_follow: refreshResponse.data.user_data?.can_follow === 1 || refreshResponse.data.user_data?.can_follow === true
                    });
                }
            } else {
                // Handle error response
                toast.error(data?.message || 'Failed to unfriend user. Please try again.');
            }
        } catch (error) {
            console.error('Error unfriending user:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to unfriend user. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsFriendLoading(false);
        }
    };

    const handleBlockClick = () => {
        setShowBlockModal(true);
    };

    const handleBlockUser = async () => {
        if (isOwnProfile) return;
        
        setIsBlockLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/friends/${userId}/block`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful block response - api_status 200 and blocked status (blocked or already_blocked)
            if (data?.api_status === '200' && (data?.blocked === 'blocked' || data?.blocked === 'already_blocked')) {
                setShowBlockModal(false);
                setIsBlocked(true);
                
                // Show appropriate message
                if (data?.blocked === 'already_blocked') {
                    toast.success('User is already blocked!');
                } else {
                    toast.success('User blocked successfully!');
                }
                
                // Refetch profile data to update the UI
                try {
                    const refreshResponse = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                            }
                        }
                    );
                    if (refreshResponse.data.api_status === '200') {
                        setUserData(refreshResponse.data);
                        setIsBlocked(refreshResponse.data.user_data?.is_blocked === 1 || refreshResponse.data.user_data?.is_blocked === true);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing profile:', refreshError);
                }
                
                // Navigate to home page after blocking
                setTimeout(() => {
                    navigate('/');
                }, 500);
            } else {
                // Handle error response
                toast.error(data?.api_text || data?.message || 'Failed to block user. Please try again.');
                setShowBlockModal(false);
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            const errorMessage = error.response?.data?.api_text || error.response?.data?.message || error.message || 'Failed to block user. Please try again later.';
            toast.error(errorMessage);
            setShowBlockModal(false);
        } finally {
            setIsBlockLoading(false);
        }
    };

    const handleUnblockUser = async () => {
        if (isOwnProfile) return;
        
        setIsBlockLoading(true);
        try {
            // Use the correct unblock endpoint
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/friends/${userId}/unblock`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                    }
                }
            );
            
            const data = response.data;
            
            // Check for successful unblock response
            if (data?.api_status === '200' || data?.ok === true) {
                setIsBlocked(false);
                toast.success('User unblocked successfully!');
                
                // Refetch profile data to update the UI
                try {
                    const refreshResponse = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                            }
                        }
                    );
                    
                    if (refreshResponse.data.api_status === '200') {
                        setUserData(refreshResponse.data);
                        setIsBlocked(refreshResponse.data.user_data?.is_blocked === 1 || refreshResponse.data.user_data?.is_blocked === true);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing profile:', refreshError);
                }
            } else {
                // Handle error response
                toast.error(data?.api_text || data?.message || 'Failed to unblock user. Please try again.');
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
            const errorMessage = error.response?.data?.api_text || error.response?.data?.message || error.message || 'Failed to unblock user. Please try again later.';
            toast.error(errorMessage);
        } finally {
            setIsBlockLoading(false);
        }
    };

    // Get counts directly from user_data
    // Add handlers for posts (similar to Home.jsx)
    const [likedPosts, setLikedPosts] = useState(() => {
        const saved = localStorage.getItem("liked_posts");
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [savedPosts, setSavedPosts] = useState(() => {
        const saved = localStorage.getItem("saved_posts");
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    const [postComments, setPostComments] = useState({});
    const [imagePopup, setImagePopup] = useState({ show: false, images: [], currentIndex: 0 });

    const handleLike = async (post_id) => {
        const post = posts.find(p => p.id === post_id);
        if (post) {
            const wasLiked = post.is_liked || likedPosts.has(post_id);
            
            setLikedPosts(prev => {
                const newLikedPosts = new Set(prev);
                if (wasLiked) {
                    newLikedPosts.delete(post_id);
                } else {
                    newLikedPosts.add(post_id);
                }
                localStorage.setItem("liked_posts", JSON.stringify([...newLikedPosts]));
                return newLikedPosts;
            });

            setPosts(prev =>
                prev.map(p =>
                    p.id === post_id
                        ? {
                            ...p,
                            reactions_count: wasLiked
                                ? Math.max(0, parseInt(p.reactions_count || 0) - 1)
                                : parseInt(p.reactions_count || 0) + 1,
                            is_liked: !wasLiked
                        }
                        : p
                )
            );
        }
    };

    const handleReaction = async (postId, reactionType) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/posts/${postId}/reactions`,
                { reaction: reactionType.toString() },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );
            const data = await response.data;
            if (data?.ok === true) {
                const isRemoved = data.data.action === 'removed';
                const totalReactions = Object.values(data.data.reaction_counts).reduce((sum, count) => sum + count, 0);

                setPosts(prev =>
                    prev.map(post =>
                        post.id === postId
                            ? {
                                ...post,
                                reactions_count: totalReactions,
                                is_liked: !isRemoved,
                                reaction_counts: data.data.reaction_counts,
                                current_reaction: isRemoved ? null : data.data.user_reaction,
                                user_reaction: isRemoved ? null : data.data.user_reaction
                            }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePollVote = async (postId, optionId) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/polls/vote`,
                { id: optionId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        "Accept": "application/json"
                    },
                }
            );

            const data = await response.data;
            if (data?.ok === true || data?.api_status === 200) {
                setPosts(prev =>
                    prev.map(post => {
                        if (post.id === postId) {
                            const updatedOptions = data?.data?.poll_options || data?.poll_options;
                            
                            if (updatedOptions && Array.isArray(updatedOptions)) {
                                const totalVotes = updatedOptions.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                                const optionsWithPercentages = updatedOptions.map(opt => ({
                                    ...opt,
                                    percentage: totalVotes > 0 ? ((opt.votes || 0) / totalVotes) * 100 : 0
                                }));
                                
                                return {
                                    ...post,
                                    poll_options: optionsWithPercentages
                                };
                            }
                        }
                        return post;
                    })
                );
                toast.success('Vote submitted successfully');
            } else {
                toast.error(data?.message || 'Failed to submit vote');
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || 'Error submitting vote';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const savePost = async (post_id) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const wasSaved = savedPosts.has(post_id);

            const response = wasSaved
                ? await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/posts/${post_id}/save`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        "Accept": "application/json"
                    },
                })
                : await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/posts/${post_id}/save`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        "Accept": "application/json"
                    },
                });

            const data = await response.data;
            if (data?.ok === true) {
                setSavedPosts(prev => {
                    const newSavedPosts = new Set(prev);
                    if (wasSaved) {
                        newSavedPosts.delete(post_id);
                    } else {
                        newSavedPosts.add(post_id);
                    }
                    localStorage.setItem("saved_posts", JSON.stringify([...newSavedPosts]));
                    return newSavedPosts;
                });

                setPosts(prev =>
                    prev.map(post =>
                        post.id === post_id
                            ? { ...post, is_post_saved: !wasSaved }
                            : post
                    )
                );
            }
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setLoading(false);
        }
    };

    const reportPost = async (post_id) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const formData = new URLSearchParams();
            formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
            formData.append('action', 'report');
            formData.append('post_id', post_id);
            const response = await fetch(`https://ouptel.com/api/post-actions?access_token=${accessToken}`, {
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
                toast.success('Post reported successfully');
            }
        } catch (error) {
            console.error('Error reporting post:', error);
        } finally {
            setLoading(false);
        }
    };

    const hidePost = async (post_id) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/posts/hide`,
                { post_id: post_id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                        "Accept": "application/json"
                    },
                }
            );
            const data = await response.data;
            if (data?.ok === true) {
                setPosts(prev => prev.filter(post => post.id !== post_id));
                toast.success('Post hidden successfully');
            } else {
                toast.error(data?.message || 'Failed to hide post');
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || 'Error hiding post';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (post_id) => {
        try {
            const accessToken = localStorage.getItem("access_token");
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/posts/${post_id}/comments`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    "Accept": "application/json"
                },
            });
            const data = await response.data;
            if (data?.ok === true) {
                setPostComments(prev => {
                    const newState = {
                        ...prev,
                        [post_id]: data.data.comments
                    };
                    return newState;
                });
                return data.data.comments;
            } else {
                setPostComments(prev => ({
                    ...prev,
                    [post_id]: []
                }));
                return [];
            }
        } catch (error) {
            return [];
        }
    };

    const commentPost = async (post_id, comment = '') => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const requestBody = { text: comment };
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/posts/${post_id}/comments`,
                requestBody,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    }
                }
            );
            const data = response.data;
            if (data?.ok === true) {
                const newComment = {
                    id: Date.now(),
                    text: comment,
                    Orginaltext: comment,
                    time: Math.floor(Date.now() / 1000),
                    publisher: {
                        first_name: 'You',
                        last_name: '',
                        avatar: '/perimg.png'
                    }
                };
                setPostComments(prev => {
                    const currentComments = prev[post_id] || [];
                    return { ...prev, [post_id]: [newComment, ...currentComments] };
                });
                setPosts(prev =>
                    prev.map(post =>
                        post.id === post_id
                            ? { ...post, comments_count: Number(post.comments_count || 0) + 1 }
                            : post
                    )
                );
                return { success: true, comment: newComment };
            } else {
                return { success: false, error: data };
            }
        } catch (error) {
            toast.error(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const getFileTypeProps = (post) => {
        const ensureFullUrl = (url) => {
            if (!url) return null;
            if (url.startsWith('http://') || url.startsWith('https://')) {
                return url;
            }
            return `https://ouptel.com/${url.replace(/^\//, '')}`;
        };

        // Check for video first (from timeline API: postVideo or post_video_url)
        if (post?.post_video_url || post?.postVideo) {
            const videoUrl = post.post_video_url || post.postVideo;
            if (videoUrl && videoUrl !== '') {
                return { video: ensureFullUrl(videoUrl) };
            }
        }

        if (post?.post_record_url) {
            const isAudio = post?.post_type === 'audio' || 
                            post?.post_record_url.includes('/audio/') ||
                            post?.post_record_url.includes('/sounds/') ||
                            /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record_url);
            if (isAudio) {
                return { audio: ensureFullUrl(post.post_record_url) };
            }
        }

        if (post?.album_images && Array.isArray(post.album_images) && post.album_images.length > 0) {
            const processedImages = post.album_images.map(img => ({
                id: img.id,
                image: ensureFullUrl(img.image_url),
                image_org: ensureFullUrl(img.image_url)
            }));
            return {
                image: processedImages[0]?.image || processedImages[0]?.image_org,
                multipleImages: processedImages,
                hasMultipleImages: processedImages.length > 1
            };
        }

        if (post?.post_photo_url) {
            return { image: ensureFullUrl(post.post_photo_url) };
        }

        if (post?.postFile_full) {
            const url = ensureFullUrl(post.postFile_full);
            const fileName = post.postFileName || '';
            const ext = fileName.split('.').pop()?.toLowerCase() || '';
            const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff", "tif"];
            const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "m4v"];
            const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "wma", "m4a"];

            if (imageExtensions.includes(ext)) {
                return { image: url };
            } else if (videoExtensions.includes(ext)) {
                return { video: url };
            } else if (audioExtensions.includes(ext)) {
                return { audio: url };
            } else {
                return { file: url };
            }
        }

        return {};
    };

    const openImagePopup = (images, currentIndex = 0) => {
        setImagePopup({ show: true, images, currentIndex });
    };

    const closeImagePopup = () => {
        setImagePopup({ show: false, images: [], currentIndex: 0 });
    };

    const getCounts = () => {
        return {
            post_count: userData?.user_data?.post_count || 0,
            followers_count: userData?.user_data?.followers_number || 0,
            following_count: userData?.user_data?.following_number || 0,
        };
    };

    const counts = getCounts();

    const handleOpenModal = (type) => {
        // For posts, just scroll to posts section instead of opening modal
        if (type === 'posts') {
            const postsSection = document.querySelector('[data-posts-section]');
            if (postsSection) {
                postsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        setModalType(type);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalType(null);
    };

    // Get users for modal based on type - using data from API response
    const getModalUsers = () => {
        if (modalType === 'followers') {
            // Return followers array from API response
            return Array.isArray(userData?.followers) ? userData.followers : [];
        } else if (modalType === 'following') {
            // Return following array from API response
            return Array.isArray(userData?.following) ? userData.following : [];
        } else if (modalType === 'friends') {
            // Return friends array
            return Array.isArray(friends) ? friends : [];
        }
        return [];
    };

  // Show error message if API fails
  if (error && !userData) {
    return (
      <div className="w-full h-full pt-8 bg-[#EDF6F9] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading profile: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" w-full h-auto pt-8 bg-[#EDF6F9]">
        <div className="flex flex-col  border border-[#d3d1d1] rounded-xl overflow-hidden">
            <div 
                className="relative h-[200px] w-full"
                style={{
                    backgroundImage: `url(${userData?.user_data?.cover_url})`, 
                    backgroundSize: "cover", 
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                {/* Edit Button - Only show on own profile */}
                {isOwnProfile && (
                    <button 
                        onClick={handleEditProfile}
                        className="absolute top-4 right-4 border cursor-pointer bg-white text-black border-[#d3d1d1] px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                        <LiaEdit className="w-5 h-5" />
                        Edit
                    </button>
                )}
            </div>
            <div className="relative w-full bg-[#FFFFFF] px-4 sm:px-6 lg:px-10 py-5">
                {/* Mobile Layout */}
                <div className="flex flex-col sm:hidden">
                    {/* Avatar and Name */}
                    <div className="flex flex-col items-center text-center mb-6">
                        <Avatar 
                            src={userData?.user_data?.avatar_url} 
                            name={`${userData?.user_data?.first_name || 'Aman'} ${userData?.user_data?.last_name || 'Shaikh'}`}
                            email={userData?.user_data?.email || "45amanshaikh@gmail.com"}
                            alt="profile photo" 
                            size="2xl"
                            className='mt-[-5rem] z-10 border border-[#d3d1d1] shadow-lg' 
                        />
                        <div className="flex flex-col gap-1 text-[#212121] mt-4">
                            <div className="flex items-center justify-center gap-2">
                                <h3 className='text-lg font-medium'>
                                    {loading ? 'Loading...' : `${userData?.user_data?.first_name || 'Aman'} ${userData?.user_data?.last_name || 'Shaikh'}`}
                                </h3>
                                {badgeInfo?.is_verified && badgeInfo?.badge_type && (
                                    <img 
                                        src="/icons/verified.png" 
                                        alt="Verified Badge" 
                                        className="w-5 h-5"
                                        title={badgeInfo?.badge_info || 'Verified User'}
                                    />
                                )}
                                {!isOwnProfile && (userData?.user_data?.is_following_me === 1 || userData?.user_data?.is_following_me === true) && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                        Follows you
                                    </span>
                                )}
                            </div>
                            <p className='text-sm font-medium'>
                                @{userData?.user_data?.username || 'aman.shaikh'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex items-center justify-around mb-4">
                        <div 
                            className="flex flex-col gap-1 text-center cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('posts')}
                            title="View posts"
                        >
                            <p className='text-lg font-medium text-[#212121]'>
                                {loading ? '...' : counts.post_count}
                            </p>
                            <p className='text-xs font-medium text-[#808080]'>Posts</p>
                        </div>
                        <div className="w-[1px] h-[40px] bg-[#808080]"></div>
                        <div 
                            className="flex flex-col gap-1 text-center cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('friends')}
                            title="View friends"
                        >
                            <p className='text-lg font-medium text-[#212121]'>
                                {friendsLoading ? '...' : friends.length}
                            </p>
                            <p className='text-xs font-medium text-[#808080]'>Friends</p>
                        </div>
                        <div className="w-[1px] h-[40px] bg-[#808080]"></div>
                        <div 
                            className="flex flex-col gap-1 text-center cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('followers')}
                            title="View followers"
                        >
                            <p className='text-lg font-medium text-[#212121]'>
                                {loading ? '...' : counts.followers_count}
                            </p>
                            <p className='text-xs font-medium text-[#808080]'>Followers</p>
                        </div>
                        <div className="w-[1px] h-[40px] bg-[#808080]"></div>
                        <div 
                            className="flex flex-col gap-1 text-center cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('following')}
                            title="View following"
                        >
                            <p className='text-lg font-medium text-[#212121]'>
                                {loading ? '...' : counts.following_count}
                            </p>
                            <p className='text-xs font-medium text-[#808080]'>Following</p>
                        </div>
                    </div>

                    {/* Action Buttons - Below Stats (Mobile) */}
                    {!isOwnProfile && (
                        <div className="flex flex-col gap-2">
                            {/* Follow/Unfollow Button */}
                            {friendStatus.can_follow && (
                                userData?.user_data?.is_following ? (
                                    <button
                                        onClick={handleUnfollow}
                                        disabled={isFollowLoading}
                                        className="w-full px-6 py-2 border border-blue-500 text-blue-500 bg-transparent rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isFollowLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                <span>Unfollowing...</span>
                                            </>
                                        ) : (
                                            'Unfollow'
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFollow}
                                        disabled={isFollowLoading}
                                        className="w-full px-6 py-2 border border-blue-500 text-blue-500 bg-transparent rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isFollowLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                <span>Following...</span>
                                            </>
                                        ) : (
                                            'Follow'
                                        )}
                                    </button>
                                )
                            )}
                            
                            {/* Friend Request Buttons */}
                            {friendStatus.is_friend ? (
                                // Already Friends - Show Unfriend button
                                <button
                                    onClick={handleUnfriendClick}
                                    disabled={isFriendLoading}
                                    className="w-full px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                    </svg>
                                    Friends
                                </button>
                            ) : friendStatus.friend_request_received ? (
                                // Received Friend Request - Show Accept button
                                <button
                                    onClick={handleAcceptFriendRequest}
                                    disabled={isFriendLoading}
                                    className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isFriendLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Accepting...</span>
                                        </>
                                    ) : (
                                        'Accept Friend Request'
                                    )}
                                </button>
                            ) : friendStatus.friend_request_sent ? (
                                // Sent Friend Request - Show Cancel button
                                <button
                                    onClick={handleCancelFriendRequest}
                                    disabled={isFriendLoading}
                                    className="w-full px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isFriendLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                            <span>Cancelling...</span>
                                        </>
                                    ) : (
                                        'Cancel Request'
                                    )}
                                </button>
                            ) : (
                                // No relationship - Show Add Friend button
                                <button
                                    onClick={handleSendFriendRequest}
                                    disabled={isFriendLoading}
                                    className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isFriendLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        'Add Friend'
                                    )}
                                </button>
                            )}

                            {/* Block/Unblock User Button */}
                            {isBlocked ? (
                                <button
                                    onClick={handleUnblockUser}
                                    disabled={isBlockLoading}
                                    className="w-full px-6 py-2 border border-green-500 text-green-500 bg-transparent rounded-lg font-medium hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isBlockLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                            <span>Unblocking...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Unblock User
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleBlockClick}
                                    disabled={isBlockLoading}
                                    className="w-full px-6 py-2 border border-red-500 text-red-500 bg-transparent rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                    Block User
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <Avatar 
                            src={userData?.user_data?.avatar_url} 
                            name={`${userData?.user_data?.first_name || 'Aman'} ${userData?.user_data?.last_name || 'Shaikh'}`}
                            email={userData?.user_data?.email || "45amanshaikh@gmail.com"}
                            alt="profile photo" 
                            size="2xl"
                            className='mt-[-5rem] z-10 border border-[#d3d1d1] shadow-lg' 
                        />
                        <div className="flex flex-col gap-2 text-[#212121]"> 
                            <div className="flex items-center gap-2">
                                <h3 className='text-lg lg:text-xl font-medium'>
                                    {loading ? 'Loading...' : `${userData?.user_data?.first_name || 'Aman'} ${userData?.user_data?.last_name || 'Shaikh'}`}
                                </h3>
                                {badgeInfo?.is_verified && badgeInfo?.badge_type && (
                                    <img 
                                        src="/icons/verified.png" 
                                        alt="Verified Badge" 
                                        className="w-5 h-5"
                                        title={badgeInfo?.badge_info || 'Verified User'}
                                    />
                                )}
                                {!isOwnProfile && (userData?.user_data?.is_following_me === 1 || userData?.user_data?.is_following_me === true) && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                        Follows you
                                    </span>
                                )}
                            </div>
                            <p className='text-sm font-medium'>
                                @{userData?.user_data?.username || 'aman.shaikh'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 lg:gap-5">
                        <div 
                            className="flex flex-col gap-2 text-center items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('posts')}
                            title="View posts"
                        >
                            <p className='text-lg lg:text-xl font-medium text-[#212121]'>
                                {loading ? '...' : counts.post_count}
                            </p>
                            <p className='text-xs lg:text-sm font-medium text-[#808080]'>Posts</p>
                        </div>
                        <div className="w-[1px] h-[45px] lg:h-[55px] bg-[#808080]"></div>
                        <div 
                            className="flex flex-col gap-2 text-center items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('friends')}
                            title="View friends"
                        >
                            <p className='text-lg lg:text-xl font-medium text-[#212121]'>
                                {friendsLoading ? '...' : friends.length}
                            </p>
                            <p className='text-xs lg:text-sm font-medium text-[#808080]'>Friends</p>
                        </div>
                        <div className="w-[1px] h-[45px] lg:h-[55px] bg-[#808080]"></div>
                        <div 
                            className="flex flex-col gap-2 text-center items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('followers')}
                            title="View followers"
                        >
                            <p className='text-lg lg:text-xl font-medium text-[#212121]'>
                                {loading ? '...' : counts.followers_count}
                            </p>
                            <p className='text-xs lg:text-sm font-medium text-[#808080]'>Followers</p>
                        </div>
                        <div className="w-[1px] h-[45px] lg:h-[55px] bg-[#808080]"></div>
                        <div 
                            className="flex flex-col gap-2 text-center items-center justify-between cursor-pointer hover:opacity-70 transition-opacity"
                            onClick={() => handleOpenModal('following')}
                            title="View following"
                        >
                            <p className='text-lg lg:text-xl font-medium text-[#212121]'>
                                {loading ? '...' : counts.following_count}
                            </p>
                            <p className='text-xs lg:text-sm font-medium text-[#808080]'>Following</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Below Stats (Desktop) */}
                {!isOwnProfile && (
                    <div className="hidden sm:flex items-center gap-3 mt-4 justify-end">
                        {/* Follow/Unfollow Button */}
                        {friendStatus.can_follow && (
                            userData?.user_data?.is_following ? (
                                <button
                                    onClick={handleUnfollow}
                                    disabled={isFollowLoading}
                                    className="px-6 py-2 border border-blue-500 text-blue-500 bg-transparent rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isFollowLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span>Unfollowing...</span>
                                        </>
                                    ) : (
                                        'Unfollow'
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleFollow}
                                    disabled={isFollowLoading}
                                    className="px-6 py-2 border border-blue-500 text-blue-500 bg-transparent rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isFollowLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span>Following...</span>
                                        </>
                                    ) : (
                                        'Follow'
                                    )}
                                </button>
                            )
                        )}
                        
                        {/* Friend Request Buttons */}
                        {friendStatus.is_friend ? (
                            // Already Friends - Show Unfriend button
                            <button
                                onClick={handleUnfriendClick}
                                disabled={isFriendLoading}
                                className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                Friends
                            </button>
                        ) : friendStatus.friend_request_received ? (
                            // Received Friend Request - Show Accept button
                            <button
                                onClick={handleAcceptFriendRequest}
                                disabled={isFriendLoading}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isFriendLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Accepting...</span>
                                    </>
                                ) : (
                                    'Accept Friend Request'
                                )}
                            </button>
                        ) : friendStatus.friend_request_sent ? (
                            // Sent Friend Request - Show Cancel button
                            <button
                                onClick={handleCancelFriendRequest}
                                disabled={isFriendLoading}
                                className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isFriendLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                        <span>Cancelling...</span>
                                    </>
                                ) : (
                                    'Cancel Request'
                                )}
                            </button>
                        ) : (
                            // No relationship - Show Add Friend button
                            <button
                                onClick={handleSendFriendRequest}
                                disabled={isFriendLoading}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isFriendLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    'Add Friend'
                                )}
                            </button>
                        )}

                        {/* Block/Unblock User Button */}
                        {isBlocked ? (
                            <button
                                onClick={handleUnblockUser}
                                disabled={isBlockLoading}
                                className="px-6 py-2 border border-green-500 text-green-500 bg-transparent rounded-lg font-medium hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isBlockLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                        <span>Unblocking...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Unblock User
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={handleBlockClick}
                                disabled={isBlockLoading}
                                className="px-6 py-2 border border-red-500 text-red-500 bg-transparent rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Block User
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
        {/* Only show CreatePostSection on own profile */}
        {isOwnProfile && (
            <div className="w-full mt-4 px-5">
                <CreatePostSection 
                    fetchNewFeeds={async () => {
                        // Show success toast
                        // toast.success('Post created successfully!');
                        
                        // Refetch user data to update post count
                        try {
                            const response = await axios.get(
                                `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                                    }
                                }
                            );
                            if (response.data.api_status === '200') {
                                setUserData(response.data);
                            }
                        } catch (error) {
                            console.error('Error refreshing profile:', error);
                        }
                        
                        // Refetch posts
                        try {
                            setPostsLoading(true);
                            const username = userData?.user_data?.username;
                            
                            if (username) {
                                const response = await axios.get(
                                    `${import.meta.env.VITE_API_URL}/api/v1/timeline?u=${username}&limit=20&page=1`,
                                    {
                                        headers: {
                                            "Authorization": "Bearer " + localStorage.getItem('access_token'),
                                            "Content-Type": "application/json",
                                        }
                                    }
                                );
                                const data = response.data;
                                if (data.api_status === '200' && Array.isArray(data.posts)) {
                                    const formattedPosts = data.posts.map(post => {
                                        const postUser = post.user || {
                                            user_id: post.user_id || userData.user_data.user_id,
                                            username: post.username || username,
                                            name: post.name || `${userData.user_data.first_name || ''} ${userData.user_data.last_name || ''}`.trim() || userData.user_data.name,
                                            avatar_url: post.avatar_url || post.avatar || userData.user_data.avatar_url
                                        };

                                        return {
                                            id: post.id || post.post_id,
                                            author: postUser,
                                            post_text: post.postText || post.post_text || post.text || '',
                                            post_type: post.postType || post.post_type,
                                            poll_id: post.poll_id,
                                            poll_options: post.poll_options,
                                            reactions_count: post.reactions_count || post.likes_count || 0,
                                            comments_count: post.comments_count || 0,
                                            shares_count: post.shares_count || 0,
                                            is_liked: post.is_liked || false,
                                            is_post_saved: post.is_post_saved || false,
                                            created_at_human: post.created_at_human || post.time_ago || (post.time ? new Date(post.time * 1000).toLocaleString() : 'Unknown'),
                                            created_at: post.created_at || (post.time ? new Date(post.time * 1000).toISOString() : null),
                                            post_photo_url: post.post_photo_url || (post.postPhoto && post.postPhoto !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postPhoto}` : null),
                                            post_file_url: post.post_file_url || (post.postFile && post.postFile !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postFile}` : null),
                                            post_video_url: post.post_video_url || (post.postVideo && post.postVideo !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postVideo}` : null),
                                            post_file: post.post_file || post.postFile,
                                            postFileName: post.postFileName,
                                            post_youtube: post.post_youtube || post.postYoutube,
                                            album_images: post.album_images,
                                            multi_image_post: post.multi_image_post,
                                            reaction_counts: post.reaction_counts,
                                            user_reaction: post.user_reaction,
                                            current_reaction: post.current_reaction,
                                            blog: post.blog
                                        };
                                    });
                                    setPosts(formattedPosts);
                                    setCurrentPage(1);
                                    
                                    // Update pagination state
                                    if (data.pagination) {
                                        setHasMorePosts(data.pagination.has_more || data.pagination.current_page < data.pagination.last_page);
                                        setTotalPosts(data.pagination.total || 0);
                                    }
                                }
                            }
                        } catch (err) {
                            console.error('Error refetching posts:', err);
                        } finally {
                            setPostsLoading(false);
                        }
                    }}
                    showNotification={(message, type) => {
                        if (type === 'success') {
                            toast.success(message);
                        } else if (type === 'error') {
                            toast.error(message);
                        } else {
                            toast.info(message);
                        }
                    }}
                />
            </div>
        )}
        <div className="w-full mt-4 px-5">
            <QuickActionSection />
        </div>
        
        <div className="w-full mt-4 px-5" data-posts-section>
            {postsLoading ? (
                <Loader />
            ) : posts.length > 0 ? (
                posts.map((post) => {
                    const postId = post?.id;
                    const commentsForPost = postComments[postId] || [];

                    return (
                        <div key={postId} className="mb-4">
                            <PostCard
                                post_id={postId}
                                user={post?.author || post?.publisher}
                                content={post?.post_text || post?.postText}
                                blog={post?.blog}
                                iframelink={post?.post_youtube || post?.postYoutube}
                                postfile={post?.post_file_url || post?.post_file || post?.postFile}
                                postFileName={post?.postFileName}
                                {...getFileTypeProps(post)}
                                likes={post?.reactions_count || post?.post_likes}
                                comments={post?.comments_count || post?.post_comments}
                                shares={post?.shares_count || post?.post_shares}
                                saves={post?.is_post_saved}
                                timeAgo={post?.created_at_human || post?.post_created_at}
                                handleLike={handleLike}
                                isLiked={post?.is_liked || likedPosts.has(postId)}
                                isSaved={savedPosts.has(postId)}
                                fetchComments={fetchComments}
                                commentsData={commentsForPost}
                                savePost={savePost}
                                reportPost={reportPost}
                                hidePost={hidePost}
                                commentPost={commentPost}
                                getNewsFeed={() => {
                                    // Refetch posts when needed using timeline API
                                    const fetchUserPosts = async () => {
                                        try {
                                            setPostsLoading(true);
                                            const username = userData?.user_data?.username;
                                            
                                            if (username) {
                                                const response = await axios.get(
                                                    `${import.meta.env.VITE_API_URL}/api/v1/timeline?u=${username}&limit=20&page=1`,
                                                    {
                                                        headers: {
                                                            "Authorization": "Bearer " + localStorage.getItem('access_token'),
                                                            "Content-Type": "application/json",
                                                        }
                                                    }
                                                );
                                                const data = response.data;
                                                if (data.api_status === '200' && Array.isArray(data.posts)) {
                                                    const formattedPosts = data.posts.map(post => {
                                                        const postUser = post.user || {
                                                            user_id: post.user_id || userData.user_data.user_id,
                                                            username: post.username || username,
                                                            name: post.name || `${userData.user_data.first_name || ''} ${userData.user_data.last_name || ''}`.trim() || userData.user_data.name,
                                                            avatar_url: post.avatar_url || post.avatar || userData.user_data.avatar_url
                                                        };

                                                        return {
                                                            id: post.id || post.post_id,
                                                            author: postUser,
                                                            post_text: post.postText || post.post_text || post.text || '',
                                                            post_type: post.postType || post.post_type,
                                                            poll_id: post.poll_id,
                                                            poll_options: post.poll_options,
                                                            reactions_count: post.reactions_count || post.likes_count || 0,
                                                            comments_count: post.comments_count || 0,
                                                            shares_count: post.shares_count || 0,
                                                            is_liked: post.is_liked || false,
                                                            is_post_saved: post.is_post_saved || false,
                                                            created_at_human: post.created_at_human || post.time_ago || (post.time ? new Date(post.time * 1000).toLocaleString() : 'Unknown'),
                                                            created_at: post.created_at || (post.time ? new Date(post.time * 1000).toISOString() : null),
                                                            post_photo_url: post.post_photo_url || (post.postPhoto && post.postPhoto !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postPhoto}` : null),
                                                            post_file_url: post.post_file_url || (post.postFile && post.postFile !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postFile}` : null),
                                                            post_video_url: post.post_video_url || (post.postVideo && post.postVideo !== '' ? `${import.meta.env.VITE_API_URL}/storage/${post.postVideo}` : null),
                                                            post_file: post.post_file || post.postFile,
                                                            postFileName: post.postFileName,
                                                            post_youtube: post.post_youtube || post.postYoutube,
                                                            album_images: post.album_images,
                                                            multi_image_post: post.multi_image_post,
                                                            reaction_counts: post.reaction_counts,
                                                            user_reaction: post.user_reaction,
                                                            current_reaction: post.current_reaction,
                                                            blog: post.blog
                                                        };
                                                    });
                                                    setPosts(formattedPosts);
                                                    
                                                    // Update pagination state
                                                    if (data.pagination) {
                                                        setHasMorePosts(data.pagination.has_more || data.pagination.current_page < data.pagination.last_page);
                                                        setTotalPosts(data.pagination.total || 0);
                                                        setCurrentPage(1);
                                                    }
                                                }
                                            }
                                        } catch (err) {
                                            console.error('Error refetching posts:', err);
                                        } finally {
                                            setPostsLoading(false);
                                        }
                                    };
                                    fetchUserPosts();
                                }}
                                openImagePopup={openImagePopup}
                                handleReaction={handleReaction}
                                postReaction={post?.user_reaction || post?.current_reaction}
                                postReactionCounts={post?.reaction_counts}
                                currentReaction={post?.current_reaction || post?.user_reaction}
                                userReaction={post?.user_reaction}
                                postType={post?.post_type}
                                pollOptions={post?.poll_options}
                                handlePollVote={(optionId) => handlePollVote(postId, optionId)}
                                isPollLoading={loading}
                            />
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-500">No posts yet</p>
                    <p className="text-sm text-gray-400 mt-2">Start sharing your thoughts!</p>
                </div>
            )}
            
            {/* Infinite scroll observer target */}
            {hasMorePosts && posts.length > 0 && (
                <div ref={observerTarget} className="flex justify-center py-6">
                    {isLoadingMore && (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-500 text-sm">Loading more posts...</span>
                        </div>
                    )}
                </div>
            )}
            
            {/* End of posts message */}
            {!hasMorePosts && posts.length > 0 && !postsLoading && (
                <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">You've reached the end</p>
                </div>
            )}
        </div>

        {/* Followers/Following Modal */}
        <FollowersFollowingModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            type={modalType}
            users={getModalUsers()}
            loading={loading}
        />

        {/* Unfriend Confirmation Modal */}
        {showUnfriendModal && (
            <ConfirmModal
                title="Remove Friend"
                message={`Are you sure you want to remove ${userData?.user_data?.first_name || ''} ${userData?.user_data?.last_name || ''} from your friends? You can always send a friend request again later.`}
                onConfirm={handleUnfriend}
                onCancel={() => setShowUnfriendModal(false)}
                loading={isFriendLoading}
                confirmText="Remove Friend"
                cancelText="Cancel"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconColor="red"
                loadingText="Removing..."
            />
        )}

        {/* Block User Confirmation Modal */}
        {showBlockModal && (
            <ConfirmModal
                title="Block User"
                message={`Are you sure you want to block ${userData?.user_data?.first_name || ''} ${userData?.user_data?.last_name || ''}? They will no longer be able to see your profile, send you messages, or interact with your content. You will be redirected to the home page.`}
                onConfirm={handleBlockUser}
                onCancel={() => setShowBlockModal(false)}
                loading={isBlockLoading}
                confirmText="Block User"
                cancelText="Cancel"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
                iconColor="red"
                loadingText="Blocking..."
            />
        )}

        {/* Image Popup/Modal */}
        {imagePopup.show && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
                    {/* Close button */}
                    <button
                        onClick={closeImagePopup}
                        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                    >
                        ×
                    </button>

                    {/* Previous button */}
                    {imagePopup.images.length > 1 && (
                        <button
                            onClick={() => {
                                setImagePopup(prev => ({
                                    ...prev,
                                    currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
                                }));
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                        >
                            ‹
                        </button>
                    )}

                    {/* Next button */}
                    {imagePopup.images.length > 1 && (
                        <button
                            onClick={() => {
                                setImagePopup(prev => ({
                                    ...prev,
                                    currentIndex: (prev.currentIndex + 1) % prev.images.length
                                }));
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                        >
                            ›
                        </button>
                    )}

                    {/* Image */}
                    <img
                        src={imagePopup.images[imagePopup.currentIndex]?.image || imagePopup.images[imagePopup.currentIndex]?.image_org}
                        alt={`Image ${imagePopup.currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                        style={{ maxHeight: '90vh' }}
                    />

                    {/* Image counter */}
                    {imagePopup.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                            {imagePopup.currentIndex + 1} / {imagePopup.images.length}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-20 right-6 lg:bottom-6 lg:right-[17rem] xl:right-[23rem] z-[9999] bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 animate-bounce-slow"
                aria-label="Scroll to top"
                style={{ boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)' }}
            >
                <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M5 10l7-7m0 0l7 7m-7-7v18" 
                    />
                </svg>
            </button>
        )}
    </div>
  )
}

export default Profile