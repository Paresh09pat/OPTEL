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
                    // Update follow status based on API response
                    setIsFollowing(!data.user_data?.can_follow && !isOwnProfile);
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

    // Fetch user posts
    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setPostsLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/posts/user-posts?user_id=${userId}`,
                    {
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem('access_token'),
                            "Content-Type": "application/json",
                        }
                    }
                );

                const data = response.data;
                console.log('Posts API Response:', data);
                
                if (data.ok && data.data) {
                    // Transform API response to match PostCard component format
                    const transformedPosts = Array.isArray(data.data) ? data.data : [data.data];
                    const formattedPosts = transformedPosts.map(post => ({
                        id: post.post_id,
                        user: {
                            name: post.author?.username || post.author?.name || 'Unknown',
                            avatar: post.author?.avatar_url,
                            fullName: post.author?.name || 'Unknown User',
                            email: post.author?.email,
                            user_id: post.author?.user_id || post.author?.id || post.author?.userId
                        },
                        content: post.post_text || '',
                        image: post.post_photo_url || null,
                        likes: post.likes_count || '0',
                        comments: post.comments_count || '0',
                        shares: post.shares_count || '0',
                        saves: post.saves_count || '0',
                        timeAgo: post.created_at_human || 'Unknown',
                        post_type: post.post_type,
                        post_privacy: post.post_privacy_text,
                        created_at: post.created_at
                    }));
                    setPosts(formattedPosts);
                } else {
                    throw new Error('Failed to fetch posts');
                }
            } catch (err) {
                console.error('Error fetching user posts:', err);
                // Set fallback posts
                setPosts([
                    {
                        id: 1,
                        user: {
                            name: userData?.user_data?.username || 'feeliummagic',
                            avatar: userData?.user_data?.avatar_url,
                            fullName: `${userData?.user_data?.first_name || 'Feelium'} ${userData?.user_data?.last_name || 'Magic'}`,
                            email: userData?.user_data?.email
                        },
                        content: 'Explore new horizons... Follow us for design inspiration, Check out our latest graphic design and branding content. @feeliummagic...more',
                        image: '/mobile.jpg',
                        likes: '2k+',
                        comments: '100+',
                        shares: '250+',
                        saves: '50+',
                        timeAgo: '2h ago'
                    }
                ]);
            } finally {
                setPostsLoading(false);
            }
        };

        if (userData) {
            fetchUserPosts();
        }
    }, [userId, userData]);

    const handleEditProfile = () => {
        navigate('/profile-settings');
    };

    const handleFollow = async () => {
        if (isOwnProfile || !userData?.user_data?.can_follow) return;
        
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
            
            // Check if the API returned an error response
            if (data?.ok === false) {
                toast.error(data?.message || 'Failed to follow user. Please try again later.');
                return;
            }
            
            if (data?.api_status === 200 || data?.ok === true) {
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
                    // Update follow status after refresh
                    setIsFollowing(!refreshResponse.data.user_data?.can_follow && !isOwnProfile);
                }
            } else {
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

    // Get counts directly from user_data
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
                                {!isOwnProfile && userData?.user_data?.is_following_me && (
                                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                        Follows you
                                    </span>
                                )}
                            </div>
                            <p className='text-sm font-medium'>
                                @{userData?.user_data?.username || 'aman.shaikh'}
                            </p>
                            {/* Follow Button - Mobile */}
                            {!isOwnProfile && (
                                <div className="mt-2">
                                    {userData?.user_data?.can_follow ? (
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
                                    ) : (
                                        <button
                                            disabled
                                            className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                                        >
                                            {isFollowing ? 'Following' : 'Requested'}
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
                                {!isOwnProfile && userData?.user_data?.is_following_me && (
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
                                {userData?.user_data?.can_follow ? (
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
                                ) : (
                                    <button
                                        disabled
                                        className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                                    >
                                        {isFollowing ? 'Following' : 'Requested'}
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
                posts.map((post) => (
                    <div key={post.id} className="mb-4">
                        <PostCard
                            user={post.user}
                            content={post.content}
                            image={post.image}
                            likes={post.likes}
                            comments={post.comments}
                            shares={post.shares}
                            saves={post.saves}
                            timeAgo={post.timeAgo}
                        />
                    </div>
                ))
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
    </div>
  )
}

export default Profile