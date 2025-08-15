import React, { useCallback, useEffect, useState } from 'react';

import CreatePostSection from '../components/specific/Home/CreatePostSection';
import FeedCard from '../components/specific/Home/FeedCard';
import InfiniteFriendSuggestions from '../components/specific/Home/InfiniteFriendSuggestions';
import PostCard from '../components/specific/Home/PostCard';
import QuickActionsSection from '../components/specific/Home/QuickActionSection';
import ScrollableSection from '../components/specific/Home/ScrollableSection';

const feedCards = [
  {
    image: '/perimg.png',
    username: 'veer_Byte',
    isVideo: false
  },
  {
    image: '/mobile.jpg',
    username: 'rinkaNova',
    isVideo: false
  },
  {
    image: '/perimg.png',
    username: 'vikram_...',
    isVideo: false
  },
  {
    image: '/mobile.jpg',
    username: 'techyTina',
    isVideo: false
  },
  {
    image: '/perimg.png',
    username: 'shohan',
    isVideo: false
  },
  {
    image: '/perimg.png',
    username: 'alex_dev',
    isVideo: false
  },
  {
    image: '/perimg.png',
    username: 'shohan',
    isVideo: false
  },
  {
    image: '/perimg.png',
    username: 'alex_dev',
    isVideo: false
  },
];





const Home = () => {
  const [friendSuggestions, setFriendSuggestions] = useState([
    { id: 1, name: 'Siddharth Verma', username: '@muscleManSid', avatar: '/perimg.png' },
    { id: 2, name: 'Bhuvan Rana', username: '@beatsByBhuvan', avatar: '/perimg.png' },
    { id: 3, name: 'Sana Qadri', username: '@sanskariSana', avatar: '/perimg.png' },
    { id: 4, name: 'Aniket Naik', username: '@athleteAniket', avatar: '/perimg.png' },
    { id: 5, name: 'Laya Krishnan', username: '@lensByLaya', avatar: '/perimg.png' },
    { id: 6, name: 'Rajesh Kumar', username: '@rajeshkumar', avatar: '/perimg.png' },
    { id: 7, name: 'Priya Sharma', username: '@priyasharma', avatar: '/perimg.png' },
  ]);


  const [session, setSession] = useState(localStorage.getItem("session_id"));
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const getSession = async () => {
  try {
   
    setLoading(true);
    setError(null);
    
    // Get access token from localStorage
    const accessToken = localStorage.getItem("access_token") ;
    const userId = localStorage.getItem("user_id") ;

    const formData = new URLSearchParams();
    formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
    // formData.append('user_id', userId);
    formData.append('type', 'get');
    const response = await fetch(`https://ouptel.com/api/sessions?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: formData.toString(),
    })
   
    const data = await response.json();
     if (data?.api_status === 200) {
      
      localStorage.setItem("session_id", data?.data[0]?.session_id);
     
    } else {
      setError(response?.data?.errors?.error_text);
    }
    setSession(data?.data[0]?.session_id);
   
    setLoading(false);
    
  } catch (error) {
    console.error('Error fetching events:', error);
    setError(error.message);
    setLoading(false);
  }
 
}
useEffect(() => { 
  getSession();
}, []);


  const posts = [
    {
      id: 1,
      user: {
        name: 'feeliummagic',
        avatar: '/perimg.png'
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
        name: '_amu_456',
        avatar: '/perimg.png'
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

  const handleAddFriend = useCallback((friendId) => {
    setFriendSuggestions(prev =>
      prev.filter(friend => friend.id !== friendId)
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 px-2 md:px-4">Feed</h2>
          <div className="px-2 md:px-4">
            <ScrollableSection>
              {feedCards.map((card, index) => (
                <FeedCard
                  key={index}
                  image={card.image}
                  username={card.username}
                  isVideo={card.isVideo}
                />
              ))}
            </ScrollableSection>
          </div>
        </div>

        <div className="px-2 md:px-4 relative">
          <div className='mb-4 md:mb-6'>
          <CreatePostSection />
          </div>

          {/* Fixed sticky positioning issue */}
          <div className="sticky top-0 z-30 bg-[#EDF6F9] py-2 -mx-2 md:-mx-4">
            <div className="mx-2 md:mx-4">
              <QuickActionsSection />
            </div>
          </div>

          <div className="mb-4 md:mb-6 mt-4 md:mt-6 smooth-content-transition bg-white rounded-xl border border-[#808080]">
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

          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Friend Suggestions</h2>
            <InfiniteFriendSuggestions
              friendSuggestions={friendSuggestions}
              onAddFriend={handleAddFriend}
            />
          </div>

          <div className="space-y-4 md:space-y-6 mb-4 md:mb-6 bg-white rounded-xl border border-[#808080]">
            {posts.slice(1).map(post => (
              <PostCard
                key={post.id}
                user={post.user}
                content={post.content}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
                saves={post.saves}
                timeAgo={post.timeAgo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;