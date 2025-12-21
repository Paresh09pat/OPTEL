import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiEdit3 } from 'react-icons/fi'
import { LiaEdit } from 'react-icons/lia'
import CreatePostSection from '../components/specific/Home/CreatePostSection'
import QuickActionSection from '../components/specific/Home/QuickActionSection'
import PostCard from '../components/specific/Home/PostCard'
import Avatar from '../components/Avatar'
import axios from 'axios'
import Loader from '../components/loading/Loader'
import FollowersFollowingModal from '../components/specific/Profile/FollowersFollowingModal'
import { toast } from 'react-toastify'

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'followers', 'following', or 'posts'
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const navigate = useNavigate();
    const { userId: urlUserId } = useParams();

    // Get user ID from URL params, or fallback to localStorage, or default
    const userId = urlUserId || localStorage.getItem('user_id') || '222102';
    const currentUserId = localStorage.getItem('user_id');
    const isOwnProfile = !urlUserId || urlUserId === currentUserId;

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
                    // Store user data in localStorage for reuse
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
                    setIsFollowing(data.user_data?.is_following === true && !isOwnProfile);
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

    // Fetch user posts using timeline API for all profiles
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setPostsLoading(true);
                
                // Get username from userData - works for both own profile and other users
                const username = userData?.user_data?.username;
                
                if (!username) {
                    console.error('Username not available');
                    setPosts([]);
                    setPostsLoading(false);
                    return;
                }

                // Use timeline API for all profiles (own and others)
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/timeline?u=${username}&limit=20&before_post_id=`,
                    {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem('access_token'),
                            "Content-Type": "application/json",
                        }
                    }
                );
                
                const data = response.data;
                console.log('Timeline API Response:', data);
                
                if (data.api_status === '200' && Array.isArray(data.posts)) {
                    // Map timeline API response to PostCard format
                    const formattedPosts = data.posts.map(post => ({
                        id: post.id || post.post_id,
                        author: post.author || {
                            user_id: post.user_id || userData.user_data.user_id,
                            username: post.username || username,
                            name: post.name || `${userData.user_data.first_name || ''} ${userData.user_data.last_name || ''}`.trim() || userData.user_data.name,
                            avatar_url: post.avatar_url || userData.user_data.avatar_url
                        },
                        post_text: post.post_text || post.text || '',
                        post_type: post.post_type,
                        poll_id: post.poll_id,
                        poll_options: post.poll_options,
                        reactions_count: post.reactions_count || post.likes_count || 0,
                        comments_count: post.comments_count || 0,
                        shares_count: post.shares_count || 0,
                        is_liked: post.is_liked || false,
                        is_post_saved: post.is_post_saved || false,
                        created_at_human: post.created_at_human || post.time_ago || 'Unknown',
                        created_at: post.created_at,
                        post_photo_url: post.post_photo_url,
                        post_file_url: post.post_file_url,
                        post_file: post.post_file,
                        postFileName: post.postFileName,
                        post_youtube: post.post_youtube,
                        album_images: post.album_images,
                        multi_image_post: post.multi_image_post,
                        reaction_counts: post.reaction_counts,
                        user_reaction: post.user_reaction,
                        current_reaction: post.current_reaction,
                        blog: post.blog
                    }));
                    setPosts(formattedPosts);
                } else {
                    setPosts([]);
                }
            } catch (err) {
                console.error('Error fetching user posts:', err);
                setPosts([]);
            } finally {
                setPostsLoading(false);
            }
        };

        if (userData?.user_data?.username) {
            fetchUserPosts();
        }
    }, [userData]);

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
                    setIsFollowing(refreshResponse.data.user_data?.is_following === true && !isOwnProfile);
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
                    setIsFollowing(refreshResponse.data.user_data?.is_following === true && !isOwnProfile);
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
                                {!isOwnProfile && (userData?.user_data?.is_following_me === 1 || userData?.user_data?.is_following_me === true) && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                        Follows you
                                    </span>
                                )}
                            </div>
                            <p className='text-sm font-medium'>
                                @{userData?.user_data?.username || 'aman.shaikh'}
                            </p>
                         
                            {!isOwnProfile && (
                                <div className="mt-2">
                                    {userData?.user_data?.is_following ? (
                                        <button
                                            onClick={handleUnfollow}
                                            disabled={isFollowLoading}
                                            className="px-6 py-2 border border-blue-500 text-blue-500 bg-transparent rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
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
                                            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                                        >
                                            {isFollowLoading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Following...</span>
                                                </>
                                            ) : (
                                                'Follow'
                                            )}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex items-center justify-around">
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
                        {/* Follow Button - Desktop */}
                        {!isOwnProfile && (
                            <div className="mr-4">
                                {userData?.user_data?.is_following ? (
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
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isFollowLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Following...</span>
                                            </>
                                        ) : (
                                            'Follow'
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
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
            </div>
        </div>
        {/* Only show CreatePostSection on own profile */}
        {isOwnProfile && (
            <div className="w-full mt-4 px-5">
                <CreatePostSection  />
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
                                                    `${import.meta.env.VITE_API_URL}/api/v1/timeline?u=${username}&limit=20&before_post_id=`,
                                                    {
                                                        headers: {
                                                            "Authorization": "Bearer " + localStorage.getItem('access_token'),
                                                            "Content-Type": "application/json",
                                                        }
                                                    }
                                                );
                                                const data = response.data;
                                                if (data.api_status === '200' && Array.isArray(data.posts)) {
                                                    const formattedPosts = data.posts.map(post => ({
                                                        id: post.id || post.post_id,
                                                        author: post.author || {
                                                            user_id: post.user_id || userData.user_data.user_id,
                                                            username: post.username || username,
                                                            name: post.name || `${userData.user_data.first_name || ''} ${userData.user_data.last_name || ''}`.trim() || userData.user_data.name,
                                                            avatar_url: post.avatar_url || userData.user_data.avatar_url
                                                        },
                                                        post_text: post.post_text || post.text || '',
                                                        post_type: post.post_type,
                                                        poll_id: post.poll_id,
                                                        poll_options: post.poll_options,
                                                        reactions_count: post.reactions_count || post.likes_count || 0,
                                                        comments_count: post.comments_count || 0,
                                                        shares_count: post.shares_count || 0,
                                                        is_liked: post.is_liked || false,
                                                        is_post_saved: post.is_post_saved || false,
                                                        created_at_human: post.created_at_human || post.time_ago || 'Unknown',
                                                        created_at: post.created_at,
                                                        post_photo_url: post.post_photo_url,
                                                        post_file_url: post.post_file_url,
                                                        post_file: post.post_file,
                                                        postFileName: post.postFileName,
                                                        post_youtube: post.post_youtube,
                                                        album_images: post.album_images,
                                                        multi_image_post: post.multi_image_post,
                                                        reaction_counts: post.reaction_counts,
                                                        user_reaction: post.user_reaction,
                                                        current_reaction: post.current_reaction,
                                                        blog: post.blog
                                                    }));
                                                    setPosts(formattedPosts);
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
        </div>

        {/* Followers/Following Modal */}
        <FollowersFollowingModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            type={modalType}
            users={getModalUsers()}
            loading={loading}
        />

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
    </div>
  )
}

export default Profile