import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit3 } from 'react-icons/fi'
import { LiaEdit } from 'react-icons/lia'
import CreatePostSection from '../components/specific/Home/CreatePostSection'
import QuickActionSection from '../components/specific/Home/QuickActionSection'
import PostCard from '../components/specific/Home/PostCard'
import Avatar from '../components/Avatar'
import axios from 'axios'
import Loader from '../components/loading/Loader'
const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState(null);
    const navigate = useNavigate();

    // Get user ID from localStorage or URL params
    const userId = localStorage.getItem('user_id') || '222102'; // Default fallback

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
                            email: post.author?.email
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
    <div className=" w-full h-full pt-8 bg-[#EDF6F9]">
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
                {/* Edit Button */}
                <button 
                    onClick={handleEditProfile}
                    className="absolute top-4 right-4 border cursor-pointer border-[#d3d1d1] px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 font-medium"
                >
                    <LiaEdit className="w-5 h-5" />
                    Edit
                </button>
            </div>
            <div className=" relative w-full bg-[#FFFFFF] px-10 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Avatar 
                            src={userData?.user_data?.avatar_url} 
                            name={`${userData?.user_data?.first_name || 'Aman'} ${userData?.user_data?.last_name || 'Shaikh'}`}
                            email={userData?.user_data?.email || "45amanshaikh@gmail.com"}
                            alt="profile photo" 
                            size="2xl"
                            className='mt-[-5rem] z-10 border border-[#d3d1d1] shadow-lg' 
                        />
                        <div className="flex flex-col gap-2 text-[#212121]">
                            <h3 className='text-xl font-medium'>
                                {loading ? 'Loading...' : `${userData?.user_data?.first_name || 'Aman'} ${userData?.user_data?.last_name || 'Shaikh'}`}
                            </h3>
                            <p className='text-sm font-medium'>
                                @{userData?.user_data?.username || 'aman.shaikh'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-5">
                        <div className="flex flex-col gap-2 text-center items-center justify-between">
                        <p className='text-xl font-medium text-[#212121]'>
                            {loading ? '...' : userData?.user_data?.post_count || 100}
                        </p>
                        <p className='text-sm font-medium text-[#808080]'>Posts</p>
                        </div>
                        <div className="w-[1px] h-[55px] bg-[#808080] "></div>
                        <div className="flex flex-col gap-2 text-center items-center justify-between">
                        <p className='text-xl font-medium text-[#212121]'>
                            {loading ? '...' : userData?.user_data?.followers_number || 433}
                        </p>
                        <p className='text-sm font-medium text-[#808080]'>Followers</p>
                        </div>
                        <div className="w-[1px] h-[55px] bg-[#808080] "></div>
                        <div className="flex flex-col gap-2 text-center items-center justify-between">
                        <p className='text-xl font-medium text-[#212121]'>
                            {loading ? '...' : userData?.user_data?.following_number || 403}
                        </p>
                        <p className='text-sm font-medium text-[#808080]'>Following</p>
                        </div>
                    </div>
                    
            </div>
        </div>
        <div className="w-full mt-4 px-5">
        <CreatePostSection  />
        </div>
        <div className="w-full mt-4 px-5">
            <QuickActionSection />
        </div>
        <div className="w-full mt-4 px-5">
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
    </div>
  )
}

export default Profile