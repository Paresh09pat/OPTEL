import React, { useCallback, useEffect, useState } from 'react';

import CreatePostSection from '../components/specific/Home/CreatePostSection';
import FeedCard from '../components/specific/Home/FeedCard';
import InfiniteFriendSuggestions from '../components/specific/Home/InfiniteFriendSuggestions';
import PostCard from '../components/specific/Home/PostCard';
import QuickActionsSection from '../components/specific/Home/QuickActionSection';
import ScrollableSection from '../components/specific/Home/ScrollableSection';
import Loader from '../components/loading/Loader';

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
  const [session, setSession] = useState(localStorage.getItem("session_id"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [friendSuggestions, setFriendSuggestions] = useState([
    { id: 1, name: 'Siddharth Verma', username: '@muscleManSid', avatar: '/perimg.png' },
    { id: 2, name: 'Bhuvan Rana', username: '@beatsByBhuvan', avatar: '/perimg.png' },
    { id: 3, name: 'Sana Qadri', username: '@sanskariSana', avatar: '/perimg.png' },
    { id: 4, name: 'Aniket Naik', username: '@athleteAniket', avatar: '/perimg.png' },
    { id: 5, name: 'Laya Krishnan', username: '@lensByLaya', avatar: '/perimg.png' },
    { id: 6, name: 'Rajesh Kumar', username: '@rajeshkumar', avatar: '/perimg.png' },
    { id: 7, name: 'Priya Sharma', username: '@priyasharma', avatar: '/perimg.png' },
  ]);

  const [newFeeds, setNewFeeds] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem("liked_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  }); // Track which posts are liked
  const [savedPosts, setSavedPosts] = useState(() => {
    const saved = localStorage.getItem("saved_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  }); // Track which posts are saved
  const [postComments, setPostComments] = useState({}); // Track comments for each post

  const getNewFeeds = async () => {
    setLoading(true);
    try {
      setError(null);

      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'get_news_feed');
      const response = await fetch(`https://ouptel.com/api/posts?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData.toString(),
      })
      const data = await response.json();
      console.log("📰 Setting newFeeds:", data?.data);
      setNewFeeds(data?.data);
      
      // Initialize saved posts from API data
      if (data?.data) {
        const savedFromAPI = new Set();
        data.data.forEach(post => {
          if (post.is_post_saved) {
            savedFromAPI.add(post.id);
          }
        });
        setSavedPosts(prev => {
          const combined = new Set([...prev, ...savedFromAPI]);
          localStorage.setItem("saved_posts", JSON.stringify([...combined]));
          return combined;
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
      setLoading(false);
    }
  }


  useEffect(() => {
    getNewFeeds();
  }, []);





  const posts = [

  ];

  const handleAddFriend = useCallback((friendId) => {
    setFriendSuggestions(prev =>
      prev.filter(friend => friend.id !== friendId)
    );
  }, []);

  const handleLike = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('action', 'like');
      formData.append('reaction', '1');
      formData.append('post_id', post_id);
      const response = await fetch(`https://ouptel.com/api/post-actions?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          "Accept": "application/json"
        },
        body: formData.toString(),
      })
      const data = await response.json();

      // Update the liked state and like count
      if (data?.api_status === 200) {
        const wasLiked = likedPosts.has(post_id);

        setLikedPosts(prev => {
          const newLikedPosts = new Set(prev);
          if (wasLiked) {
            newLikedPosts.delete(post_id);
          } else {
            newLikedPosts.add(post_id);
          }
          // Save to localStorage
          localStorage.setItem("liked_posts", JSON.stringify([...newLikedPosts]));
          return newLikedPosts;
        });

        // Update the like count in newFeeds
        setNewFeeds(prev =>
          prev.map(post =>
            post.id === post_id
              ? {
                ...post,
                post_likes: wasLiked
                  ? Math.max(0, parseInt(post.post_likes || 0) - 1)
                  : parseInt(post.post_likes || 0) + 1
              }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDislike = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('action', 'dislike');
      formData.append('reaction', '0');
      formData.append('post_id', post_id);
      const response = await fetch(`https://ouptel.com/api/post-actions?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          "Accept": "application/json"
        },
        body: formData.toString(),
      })
      const data = await response.json();

      // Update the liked state and like count
      if (data?.api_status === 200) {
        const wasLiked = likedPosts.has(post_id);

        setLikedPosts(prev => {
          const newLikedPosts = new Set(prev);
          if (wasLiked) {
            newLikedPosts.delete(post_id);
          } else {
            newLikedPosts.add(post_id);
          }
          // Save to localStorage
          localStorage.setItem("liked_posts", JSON.stringify([...newLikedPosts]));
          return newLikedPosts;
        });

        // Update the like count in newFeeds
        setNewFeeds(prev =>
          prev.map(post =>
            post.id === post_id
              ? {
                ...post,
                post_likes: wasLiked
                  ? Math.max(0, parseInt(post.post_likes || 0) - 1)
                  : parseInt(post.post_likes || 0) + 1
              }
              : post
          )
        );
      }
    }
    catch (error) {
      console.error('Error disliking post:', error);
    } finally {
      setLoading(false);
    }
  }

  const fetchComments = async (post_id) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'fetch_comments');
      formData.append('post_id', post_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          "Accept": "application/json"
        },
        body: formData.toString(),
      })
      const data = await response.json();

      // Store comments for this specific post
      if (data?.api_status === 200 && data.data) {
        setPostComments(prev => {
          const newState = {
            ...prev,
            [post_id]: data.data
          };
          return newState;
        });
        return data.data; // Return the comments data
      } else {
        // Set empty array for posts with no comments
        setPostComments(prev => ({
          ...prev,
          [post_id]: []
        }));
        return []; // Return empty array if no data
      }
    }
    catch (error) {
      console.error('Error fetching comments for post', post_id, ':', error);
      // Set empty array on error
      setPostComments(prev => ({
        ...prev,
        [post_id]: []
      }));
      return []; // Return empty array on error
    }
  }

  const savePost = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('action', 'save');
      formData.append('post_id', post_id);
      const response = await fetch(`https://ouptel.com/api/post-actions?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          "Accept": "application/json"
        },
        body: formData.toString(),
      })
      const data = await response.json();
      if (data?.api_status === 200) {
        // Update the saved state
        const wasSaved = savedPosts.has(post_id);
        setSavedPosts(prev => {
          const newSavedPosts = new Set(prev);
          if (wasSaved) {
            newSavedPosts.delete(post_id);
          } else {
            newSavedPosts.add(post_id);
          }
          // Save to localStorage
          localStorage.setItem("saved_posts", JSON.stringify([...newSavedPosts]));
          return newSavedPosts;
        });

        // Update the saved state in newFeeds
        setNewFeeds(prev =>
          prev.map(post => 
            post.id === post_id 
              ? { ...post, is_post_saved: !wasSaved }
              : post
          )
        );
      } else {
        console.error('Error saving post:', data);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  }

  const getFileTypeProps = (post) => {
    if (!post?.postFile_full) return {};
  
    const url = post.postFile_full;
    const ext = post.postFileName?.split('.').pop()?.toLowerCase();
  
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return { image: url };
    } else if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext)) {
      return { video: url };
    } else if (["mp3", "wav", "ogg", "aac"].includes(ext)) {
      return { audio: url };
    } else {
      return { file: url };
    }
  };
  


  return (
    <>
      {loading && <Loader />}
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
              <CreatePostSection fetchNewFeeds= {getNewFeeds} />
            </div>

            {/* Fixed sticky positioning issue */}
            <div className="sticky top-0 z-30 bg-[#EDF6F9] py-2 -mx-2 md:-mx-4">
              <div className="mx-2 md:mx-4">
                <QuickActionsSection />
              </div>
            </div>

            <div className="mb-6 md:mb-8 mt-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Friend Suggestions</h2>
              <InfiniteFriendSuggestions
                friendSuggestions={friendSuggestions}
                onAddFriend={handleAddFriend}
              />
            </div>

            <div className="mb-4 md:mb-6 mt-4 flex flex-col gap-4 md:gap-6 smooth-content-transition ">
              {loading ? <Loader /> : (
                newFeeds?.map((post) => {
                  const postId = post?.id;
                  // Get comments for this post from state, with fallback to ref
                  const commentsForPost = postComments[postId] || [];
                  return (


                    <PostCard
                      key={postId}
                      post_id={postId}
                      user={post?.publisher}
                      content={post?.postText}
                      blog={post?.blog}
                      // image={post?.postPhotos}
                      {...getFileTypeProps(post)} 
                      // audio={post?.postMusic}
                      // file={post?.postFile}
                      likes={post?.post_likes}
                      comments={post?.post_comments}
                      shares={post?.post_shares}
                      saves={post?.is_post_saved}
                      timeAgo={post?.post_created_at}
                      handleLike={handleLike}
                      handleDislike={handleDislike}
                      isLiked={likedPosts.has(postId)}
                      isSaved={savedPosts.has(postId)}
                      fetchComments={fetchComments}
                      commentsData={commentsForPost}
                      savePost={savePost}
                    />
                  );
                })
              )}

            </div>



            <div className="space-y-4 md:mb-6 bg-white rounded-xl border border-[#808080]">
              {posts.slice(1).map(post => (
                <PostCard
                  key={post.id}
                  post_id={post.id}
                  user={post.user}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  shares={post.shares}
                  saves={post.saves}
                  timeAgo={post.timeAgo}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                  isLiked={likedPosts.has(post.id)}
                  isSaved={savedPosts.has(post.id)}
                  savePost={savePost}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;