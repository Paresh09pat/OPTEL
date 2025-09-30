import React, { useCallback, useEffect, useState } from 'react';

import CreatePostSection from '../components/specific/Home/CreatePostSection';
import FeedCard from '../components/specific/Home/FeedCard';
import InfiniteFriendSuggestions from '../components/specific/Home/InfiniteFriendSuggestions';
import PostCard from '../components/specific/Home/PostCard';
import QuickActionsSection from '../components/specific/Home/QuickActionSection';
import ScrollableSection from '../components/specific/Home/ScrollableSection';
import Loader from '../components/loading/Loader';
import axios from 'axios';

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
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [userStories, setUserStories] = useState([]);
  const [selectedUserForStories, setSelectedUserForStories] = useState(null);
  const [showStoriesPreview, setShowStoriesPreview] = useState(false); 
  const [friendSuggestions, setFriendSuggestions] = useState([
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
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const getNewFeeds = async (type) => {
    const formData = new URLSearchParams();
    
    if (type) {
      formData.append('post_type', type);
      // formData.append('f', 'posts');
      // formData.append('s', 'filter_posts');
    }

    
    try {
      setError(null);
      const accessToken = localStorage.getItem("access_token");
      setLoading(true);
     
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/new-feed`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },

      })
      const data = await response.data;
      console.log("📰 Setting newFeeds:", data?.data);
      
      // Handle new API response structure
      if (data?.data) {
        setNewFeeds(data.data);
      } else if (Array.isArray(data)) {
        // Handle case where response is directly an array
        setNewFeeds(data);
      } else {
        setNewFeeds([]);
      }

      // Initialize saved posts from API data
      const feedData = data?.data || data || [];
      if (Array.isArray(feedData)) {
        const savedFromAPI = new Set();
        feedData.forEach(post => {
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

     
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
     
    }finally{
      setLoading(false);
    }
  }


  useEffect(() => {
    getNewFeeds();
  }, []);





  const posts = [

  ];

  const followUser = useCallback(async (user_id) => {
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      // formData.append('action', 'follow');
      formData.append('user_id', user_id);
      const response = await fetch(`https://ouptel.com/api/follow-user?access_token=${accessToken}`, {
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
        console.log("User followed successfully");
        setFollowedUsers(prev => {
          const newSet = new Set(prev);
          newSet.add(user_id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoading(false);
    }
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
                reactions_count: wasLiked
                  ? Math.max(0, parseInt(post.reactions_count || post.post_likes || 0) - 1)
                  : parseInt(post.reactions_count || post.post_likes || 0) + 1,
                is_liked: !wasLiked
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
          'Accept': 'application/json'
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
                reactions_count: wasLiked
                  ? Math.max(0, parseInt(post.reactions_count || post.post_likes || 0) - 1)
                  : parseInt(post.reactions_count || post.post_likes || 0) + 1,
                is_liked: !wasLiked
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
      })
      const data = await response.json();
      if (data?.api_status === 200) {
        console.log('Post reported successfully');
        // You can add a toast notification here
      } else {
        console.error('Error reporting post:', data);
      }
    } catch (error) {
      console.error('Error reporting post:', error);
    } finally {
      setLoading(false);
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const hidePost = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('post_id', post_id);
      const response = await fetch(`https://ouptel.com/api/hide_post?access_token=${accessToken}`, {
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
        console.log('Post hidden successfully');
        // Remove the hidden post from the feed
        setNewFeeds(prev => prev.filter(post => post.id !== post_id));
        showNotification('Post hidden successfully');
      } else {
        console.error('Error hiding post:', data);
        showNotification('Failed to hide post', 'error');
      }
    } catch (error) {
      console.error('Error hiding post:', error);
      showNotification('Error hiding post', 'error');
    } finally {
      setLoading(false);
    }
  }

  const getFileTypeProps = (post) => {
    // Helper function to ensure full URL
    const ensureFullUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Add base URL for relative paths
      return `https://ouptel.com/${url.replace(/^\//, '')}`;
    };

    // Handle new API album_images structure (HIGHEST PRIORITY)
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

    // Handle new API single post_photo_url
    if (post?.post_photo_url) {
      return { image: ensureFullUrl(post.post_photo_url) };
    }

    // Handle multiple images from photo_multi array (LEGACY)
    if (post?.photo_multi && Array.isArray(post.photo_multi) && post.photo_multi.length > 0) {
      // Process all images to ensure they have full URLs
      const processedImages = post.photo_multi.map(img => ({
        ...img,
        image: ensureFullUrl(img.image),
        image_org: ensureFullUrl(img.image_org)
      }));

      return {
        image: processedImages[0]?.image || processedImages[0]?.image_org,
        multipleImages: processedImages,
        hasMultipleImages: processedImages.length > 1
      };
    }

    // Handle single image from postPhoto (LEGACY)
    if (post?.postPhoto) {
      return { image: ensureFullUrl(post.postPhoto) };
    }

    // Handle file attachments - but prioritize image detection
    if (post?.postFile_full) {
      const url = ensureFullUrl(post.postFile_full);
      const fileName = post.postFileName || '';
      const ext = fileName.split('.').pop()?.toLowerCase() || '';

      // More comprehensive image detection
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff", "tif"];
      const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "m4v"];
      const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "wma", "m4a"];

      // Check if URL contains image-like patterns (for cases where extension might be missing)
      const urlLooksLikeImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|tif)/i.test(url) ||
        url.includes('image') ||
        url.includes('photo');

      if (imageExtensions.includes(ext) || urlLooksLikeImage) {
        return { image: url };
      } else if (videoExtensions.includes(ext)) {
        return { video: url };
      } else if (audioExtensions.includes(ext)) {
        return { audio: url };
      }
      // Only show file download for non-media files
      else if (!imageExtensions.includes(ext) && !videoExtensions.includes(ext) && !audioExtensions.includes(ext)) {
        return { file: url };
      }
    }

    return {};
  };

  const commentPost = async (post_id, comment = '') => {
   
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('text', comment);
      formData.append('post_id', post_id);
      formData.append('type', 'create');

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


      if (data?.api_status === 200) {


        // Create a new comment object to add to local state
        const newComment = {
          id: Date.now(), // Temporary ID until we get the real one from API
          text: comment,
          Orginaltext: comment,
          time: Math.floor(Date.now() / 1000),
          publisher: {
            first_name: 'You', // This should come from user context
            last_name: '',
            avatar: '/perimg.png' // This should come from user context
          }
        };

        // Update the local comments state immediately
        setPostComments(prev => {
          const currentComments = prev[post_id] || [];
          return {
            ...prev,
            [post_id]: [newComment, ...currentComments]
          };
        });

        // Update the comment count in the feed
        setNewFeeds(prev =>
          prev.map(post =>
            post.id === post_id
              ? { 
                  ...post, 
                  comments_count: Number(post.comments_count || post.post_comments || 0) + 1 
                }
              : post
          )
        );

        // Return success so PostCard can clear the input
        return { success: true, comment: newComment };
      } else {
        console.error('Error posting comment:', data);
        return { success: false, error: data };
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }


  const getSession = async () => {
    setLoading(true);
    try {

     
      setError(null);

      // Get access token from localStorage
      const accessToken = localStorage.getItem("access_token");
      const userId = localStorage.getItem("user_id");

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



    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
     
    }finally{
      setLoading(false);
    }

  }


  const getFriendSuggestions = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'users');
      formData.append('limit', '10');
      const response = await fetch(`https://ouptel.com/api/fetch-recommended?access_token=${accessToken}`, {
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
        setFriendSuggestions(data?.data);
      } else {
        setError(response?.data?.errors?.error_text);
      }
    } catch (error) {
      console.error('Error fetching friend suggestions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const getuserStories = async () => {
    setLoading(true);
   try {
    const accessToken = localStorage.getItem("access_token");
    const formData = new URLSearchParams();
    formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
    // formData.append('type', 'get');
    const response = await fetch(`https://ouptel.com/api/get-user-stories?access_token=${accessToken}`, {
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
      // Extract the stories array from the response
      const storiesData = data?.stories || data?.data || [];
     
      setUserStories(storiesData);
    } else {
      console.error('Error fetching stories:', data);
      setError(data?.errors?.error_text || 'Failed to fetch stories');
    }
    setLoading(false);  
   } catch (error) {
    console.error('Error fetching user stories:', error);
    setError(error.message);
   } finally {
    setLoading(false);
   }
  }

 
 
  const handleStoryClick = (user) => {
  
    setSelectedUserForStories(user);
    setShowStoriesPreview(true);
  };

  useEffect(() => {
    getSession();
    getFriendSuggestions();
    getuserStories();
  }, []);

  return (
    <>
      {loading && <Loader />}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
          }`}>
          {notification.message}
        </div>
      )}

      <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
          <div className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 px-2 md:px-4">Feed</h2>
            <div className="px-2 md:px-4">
              <ScrollableSection>
                                 {Array.isArray(userStories || []) && (userStories || []).length > 0 ? (
                   (userStories || []).map((user, index) => {
                     console.log('User data:', user);
                     console.log('First story thumbnail:', user.stories?.[0]?.thumbnail);
                     return (
                       <FeedCard
                         key={user.user_id || index}
                         image={user.stories && user.stories.length > 0 ? user.stories[0].thumbnail : user.avatar}
                         username={user.username || user.first_name}
                         isVideo={false}
                         avatar={user.avatar}
                         onClick={() => handleStoryClick(user)}
                       />
                     );
                   })
                 ) : (
                  ""
                 )}
              </ScrollableSection>
            </div>
          </div>

          <div className="px-2 md:px-4 relative">
            <div className='mb-4 md:mb-6'>
              <CreatePostSection fetchNewFeeds={getNewFeeds} />
            </div>

            {/* Fixed sticky positioning issue */}
            <div className="sticky top-0 z-30 bg-[#EDF6F9] py-2 -mx-2 md:-mx-4">
              <div className="mx-2 md:mx-4">
                <QuickActionsSection fetchNewFeeds={getNewFeeds} />
              </div>
            </div>

            <div className="mb-6 md:mb-8 mt-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Friend Suggestions</h2>
              <InfiniteFriendSuggestions
                friendSuggestions={friendSuggestions}
                onAddFriend={followUser}
                followedUsers={followedUsers}
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
                      user={post?.author || post?.publisher}
                      content={post?.post_text || post?.postText}
                      blog={post?.blog}
                      iframelink={post?.post_youtube || post?.postYoutube}
                      postfile={post?.post_file || post?.postFile}
                      postFileName={post?.postFileName}
                      {...getFileTypeProps(post)}
                      likes={post?.reactions_count || post?.post_likes}
                      comments={post?.comments_count || post?.post_comments}
                      shares={post?.shares_count || post?.post_shares}
                      saves={post?.is_post_saved}
                      timeAgo={post?.created_at_human || post?.post_created_at}
                      handleLike={handleLike}
                      handleDislike={handleDislike}
                      isLiked={post?.is_liked || likedPosts.has(postId)}
                      isSaved={savedPosts.has(postId)}
                      fetchComments={fetchComments}
                      commentsData={commentsForPost}
                      savePost={savePost}
                      reportPost={reportPost}
                      hidePost={hidePost}
                      commentPost={commentPost}
                      getNewsFeed={getNewFeeds}
                    />
                  );
                })
              )}

            </div>



            <div className="space-y-4 md:mb-6 bg-white rounded-xl ">
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
                  reportPost={reportPost}
                  hidePost={hidePost}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stories Preview Modal */}
      {showStoriesPreview && selectedUserForStories && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] h-full overflow-y-auto">
                            <div className="p-4 border-b border-[#d3d1d1] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedUserForStories.avatar || "/perimg.png"}
                  alt={selectedUserForStories.username || selectedUserForStories.first_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUserForStories.first_name} {selectedUserForStories.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">@{selectedUserForStories.username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStoriesPreview(false);
                  setSelectedUserForStories(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-4">
              {selectedUserForStories.stories && selectedUserForStories.stories.length > 0 ? (
                <div className="space-y-4">
                  {selectedUserForStories.stories.map((story, index) => (
                    <div key={story.id} className="border border-[#d3d1d1] rounded-lg p-3">
                      {story.thumbnail && (
                        <img
                          src={story.thumbnail}
                          alt={story.description || "Story"}
                          className="w-full h-full object-cover rounded-lg mb-3"
                        />
                      )}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          {story.time_text || "Recently"}
                        </p>
                        {story.description && (
                          <p className="text-gray-900">{story.description}</p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{story.view_count || 0} views</span>
                          {story.is_viewed ? (
                            <span className="text-green-600">Viewed</span>
                          ) : (
                            <span className="text-blue-600">New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No stories available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;