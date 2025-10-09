import React, { useState, useEffect } from 'react'
import CreatePostSection from '../components/specific/Home/CreatePostSection'
import QuickActionSection from '../components/specific/Home/QuickActionSection'
import PostCard from '../components/specific/Home/PostCard'

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user ID from localStorage or URL params
    const userId = localStorage.getItem('user_id') || '222102'; // Default fallback

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data,followers,following`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            // Add any required authentication headers here
                            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
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
                        cover_url: '/profilebannerbg.png',
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

    const posts = [
        {
          id: 1,
          user: {
            name: userData?.user_data?.username || 'feeliummagic',
            avatar: userData?.user_data?.avatar_url || '/perimg.png'
          },
          content: 'Explore new horizons... Follow us for design inspiration, Check out our latest graphic design and branding content. @feeliummagic...more',
          image: '/mobile.jpg',
          likes: '2k+',
          comments: '100+',
          shares: '250+',
          saves: '50+',
          timeAgo: '2h ago'
        },
        {
          id: 2,
          user: {
            name: userData?.user_data?.username || '_amu_456',
            avatar: userData?.user_data?.avatar_url || '/perimg.png'
          },
          content: 'What a thrilling clash between MI & LSG last night! LSG got the time only with Mitchell Marsh hammering 60 off just 31 balls, powering them to a massive 204/5. Mumbai fought back strongly, but Suryakumar Yadav brought them back with a classy 67 (43). Hardik Pandya shined with the ball (3/21), but LSG\'s bowlers held their nerve in the death overs, sealing a 12-run win. Momentum shift. Playoff race heating up! This IPL just keeps getting better. #MIvsLSG #IPL2025 #CricketMadness #GameDay',
          image: null,
          likes: '2k+',
          comments: '100+',
          shares: '250+',
          saves: '50+',
          timeAgo: '4h ago'
        }
      ];
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
            <div className="relative h-[200px] w-full " style={{backgroundImage: `url('${userData?.user_data?.cover_url || '/profilebannerbg.png'}')`, backgroundSize: "cover", backgroundPosition: "center"}}></div>
            <div className=" relative w-full bg-[#FFFFFF] px-10 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <img 
                            src={userData?.user_data?.avatar_url || '/perimg.png'} 
                            alt="profile photo" 
                            className=' size-36 rounded-full object-cover mt-[-5rem] z-10 border border-[#d3d1d1] shadow-lg' 
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
        <PostCard
              user={posts[0].user}
              content={posts[0].content}
              image={posts[0].image}
              likes={posts[0].likes}
              comments={posts[0].comments}
              shares={posts[0].shares}
              saves={posts[0].saves}
              timeAgo={posts[0].timeAgo}
            />
        </div>
    </div>
  )
}

export default Profile