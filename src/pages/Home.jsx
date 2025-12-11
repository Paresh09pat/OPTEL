import React, { useCallback, useEffect, useState, useRef } from 'react';

import CreatePostSection from '../components/specific/Home/CreatePostSection';
import FeedCard from '../components/specific/Home/FeedCard';
import InfiniteFriendSuggestions from '../components/specific/Home/InfiniteFriendSuggestions';
import PostCard from '../components/specific/Home/PostCard';
import QuickActionsSection from '../components/specific/Home/QuickActionSection';
import ScrollableSection from '../components/specific/Home/ScrollableSection';
import Loader from '../components/loading/Loader';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { dummyFriendSuggestions } from '../constants/friendSuggestions';

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
  const { userData, loading: userLoading } = useUser();
  const [session, setSession] = useState(localStorage.getItem("session_id"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [userStories, setUserStories] = useState([]);
  const [selectedUserForStories, setSelectedUserForStories] = useState(null);
  const [showStoriesPreview, setShowStoriesPreview] = useState(false);
  const [friendSuggestions, setFriendSuggestions] = useState(dummyFriendSuggestions);

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

  // Image popup state
  const [imagePopup, setImagePopup] = useState({ show: false, images: [], currentIndex: 0 });

  const [postReactions, setPostReactions] = useState({}); // Track reactions for each post
  const [userLocation, setUserLocation] = useState(null); // Store user location
  const isFetchingRef = useRef(false); // Track if a request is in progress
  const lastFilterRef = useRef(null); // Track the last filter type
  const lastCallTimeRef = useRef(0); // Track the last API call time for debouncing

  // Request location access when component mounts
  useEffect(() => {
    const requestLocationAccess = () => {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.log('Geolocation is not supported by this browser.');
        return;
      }

      // Check if permission was already requested
      const locationPermissionRequested = localStorage.getItem('location_permission_requested');
      
      if (locationPermissionRequested) {
        // Permission was already requested, just get location if granted
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);
            localStorage.setItem('user_location', JSON.stringify(location));
          },
          (error) => {
            // Silently handle error if permission was already requested
            console.log('Location access denied or unavailable:', error.message);
          }
        );
        return;
      }

      // First time - show info message then request permission
      toast.info('We would like to access your location to provide better services.', {
        autoClose: 3000,
      });

      // Request permission after showing info (browser will show its own permission dialog)
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);
            localStorage.setItem('user_location', JSON.stringify(location));
            localStorage.setItem('location_permission_requested', 'true');
            toast.success('Location access granted!');
          },
          (error) => {
            localStorage.setItem('location_permission_requested', 'true');
            if (error.code === error.PERMISSION_DENIED) {
              toast.error('Location access denied. You can enable it later in your browser settings.');
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              toast.error('Location information is unavailable.');
            } else if (error.code === error.TIMEOUT) {
              toast.error('Location request timed out.');
            } else {
              toast.error('Unable to retrieve your location.');
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }, 1500);
    };

    // Request location access after a short delay to ensure page is loaded
    const timer = setTimeout(requestLocationAccess, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const getNewFeeds = useCallback(async (type) => {
    const now = Date.now();
    
    // Prevent multiple simultaneous API calls
    if (isFetchingRef.current) {
      return;
    }

    // Debounce: Prevent rapid successive calls (within 500ms)
    if (now - lastCallTimeRef.current < 500) {
      return;
    }

    // Prevent duplicate calls with the same filter within 1 second
    if (lastFilterRef.current === type && (now - lastCallTimeRef.current) < 1000) {
      return;
    }

    try {
      isFetchingRef.current = true;
      lastFilterRef.current = type;
      lastCallTimeRef.current = now;
      setError(null);
      const accessToken = localStorage.getItem("access_token");
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('per_page', '10');
      
      // Valid filter types: image, file, video, audio, blogs, articles, jobs
      const validFilters = ['image', 'file', 'video', 'audio', 'blogs', 'articles', 'jobs'];
      
      if (type && validFilters.includes(type)) {
        params.append('filter', type);
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/new-feed?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.data;


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

        // Load reactions for all posts after feed is loaded
        loadAllPostReactions(feedData);
      }
    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);


  useEffect(() => {
    getNewFeeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const posts = [];

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
        setFollowedUsers(prev => {
          const newSet = new Set(prev);
          newSet.add(user_id);
          return newSet;
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLike = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/posts/${post_id}/reactions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          "Accept": "application/json"
        },
      })
      const data = await response.data;
      // Update the liked state and like count
      if (data?.ok === true) {
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
    } finally {
      setLoading(false);
    }
  }



  const fetchComments = async (post_id) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('post_id', post_id);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/posts/${post_id}/comments`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          "Accept": "application/json"
        },
      })
      const data = await response.data;

      // Store comments for this specific post
      if (data?.ok === true) {
        setPostComments(prev => {
          const newState = {
            ...prev,
            [post_id]: data.data.comments
          };
          return newState;
        });
        return data.data.comments; // Return the comments data
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
      return [];


    }
  }

  const savePost = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const wasSaved = savedPosts.has(post_id);

      // Use DELETE method to unsave, POST method to save
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
        // Update the saved state
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
      }
    } catch (error) {
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
        // You can add a toast notification here
      } else {
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  const getPostReaction = async (post_id) => {
    // Don't set loading state for individual post reactions to avoid UI flicker and multiple loading states
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/posts/${post_id}/reactions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.error('Error getting post reaction:', error);
      return null;
    }
  }

  // Load reactions for all posts
  const loadAllPostReactions = async (posts) => {
    if (!posts || posts.length === 0) return;

    try {
      const reactionPromises = posts.map(async (post) => {
        if (post.id) {
          const reactionData = await getPostReaction(post.id);
          return { postId: post.id, reactionData };
        }
        return null;
      });

      const results = await Promise.all(reactionPromises);

      // Update postReactions state with all reaction data
      const newPostReactions = {};
      results.forEach(result => {
        if (result && result.reactionData?.ok === true) {
          newPostReactions[result.postId] = result.reactionData.data?.reaction_type || null;
        }
      });

      setPostReactions(prev => ({ ...prev, ...newPostReactions }));

      // Update newFeeds with reaction data
      setNewFeeds(prev =>
        prev.map(post => {
          const result = results.find(r => r?.postId === post.id);
          if (result && result.reactionData?.ok === true) {
            return {
              ...post,
              reaction_counts: result.reactionData.data?.reaction_counts || {},
              current_reaction: result.reactionData.data?.user_reaction || null,
              user_reaction: result.reactionData.data?.user_reaction || null
            };
          }
          return post;
        })
      );

    } catch (error) {
      console.error('Error loading post reactions:', error);
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  // Image popup handlers
  const openImagePopup = (images, currentIndex = 0) => {
    setImagePopup({ show: true, images, currentIndex });
  };

  const closeImagePopup = () => {
    setImagePopup({ show: false, images: [], currentIndex: 0 });
  };

  const nextImage = () => {
    setImagePopup(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setImagePopup(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  // Keyboard navigation for image popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (imagePopup.show) {
        if (e.key === 'Escape') {
          closeImagePopup();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imagePopup.show]);


  // Reaction popup handlers
  const showReactionPopup = (postId) => {
    setReactionPopup({
      show: true,
      postId
    });
  };

  const hideReactionPopup = () => {
    setReactionPopup({ show: false, postId: null });
  };

  const handleReaction = async (postId, reactionType) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");



      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/posts/${postId}/reactions`,
        { reaction: reactionType.toString() }, // request body
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`, // correct place
          },
        }
      );
      const data = await response.data;
      console.log(data, "data reaction");
      if (data?.ok === true) {
        const isRemoved = data.data.action === 'removed';
        const totalReactions = Object.values(data.data.reaction_counts).reduce((sum, count) => sum + count, 0);


        // Update the reaction count in newFeeds using the new API response
        setNewFeeds(prev =>
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

        // Store the reaction type for this post
        setPostReactions(prev => ({
          ...prev,
          [postId]: isRemoved ? null : data.data.user_reaction
        }));

        console.log('Reaction updated:', {
          postId,
          reactionType: data.data.user_reaction,
          isRemoved,
          currentReaction: isRemoved ? null : data.data.user_reaction
        });

        if (showNotification) {
          const message = isRemoved
            ? `${data.data.reaction_name} reaction removed!`
            : `${data.data.reaction_name} reaction added!`;
          showNotification(message, 'success');
        }
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
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
        // Remove the hidden post from the feed
        setNewFeeds(prev => prev.filter(post => post.id !== post_id));
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

    // Handle audio posts with post_record_url (HIGHEST PRIORITY for audio)
    if (post?.post_record_url) {
      // Check if it's an audio file by URL pattern or post_type
      const isAudio = post?.post_type === 'audio' || 
                      post?.post_record_url.includes('/audio/') ||
                      post?.post_record_url.includes('/sounds/') ||
                      /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record_url);
      
      if (isAudio) {
        return { audio: ensureFullUrl(post.post_record_url) };
      }
    }

    // Handle audio posts with post_record (fallback)
    if (post?.post_record) {
      // Check if it's an audio file by URL pattern or post_type
      const isAudio = post?.post_type === 'audio' || 
                      post?.post_record.includes('/audio/') ||
                      post?.post_record.includes('/sounds/') ||
                      /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record);
      
      if (isAudio) {
        return { audio: ensureFullUrl(post.post_record) };
      }
    }

    // Handle new API album_images structure
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

      // Check if URL contains audio-like patterns
      const urlLooksLikeAudio = /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(url) ||
        url.includes('audio') ||
        url.includes('sound') ||
        url.includes('posts/audio');

      if (imageExtensions.includes(ext) || urlLooksLikeImage) {
        return { image: url };
      } else if (videoExtensions.includes(ext)) {
        return { video: url };
      } else if (audioExtensions.includes(ext) || urlLooksLikeAudio) {
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

      // API body with text field
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
      console.log("response>>", response)

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

        setNewFeeds(prev =>
          prev.map(post =>
            post.id === post_id
              ? { ...post, comments_count: Number(post.comments_count || post.post_comments || 0) + 1 }
              : post
          )
        );

        console.log("data>>", data)
        return { success: true, comment: newComment };
      } else {
        return { success: false, error: data };
        toast.error(data?.errors?.error_text);
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };



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
      setError(error.message);

    } finally {
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
      if (data?.api_status === 200 && data?.data && data.data.length > 0) {
        setFriendSuggestions(data?.data);
      } else {
        // Use dummy data as fallback if API fails or returns no data
        setFriendSuggestions(dummyFriendSuggestions);
        if (response?.data?.errors?.error_text) {
          setError(response?.data?.errors?.error_text);
        }
      }

      
    } catch (error) {
      // Use dummy data as fallback on error
      setFriendSuggestions(dummyFriendSuggestions);
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
        setError(data?.errors?.error_text || 'Failed to fetch stories');
      }
      setLoading(false);
    } catch (error) {
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

  // Show loader while user data is loading
  if (userLoading) {
    return <Loader />;
  }

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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 px-2 md:px-4">Vibe</h2>
            <div className="px-2 md:px-4">
              <ScrollableSection>
                {Array.isArray(userStories || []) && (userStories || []).length > 0 ? (
                  (userStories || []).map((user, index) => {

                    return (
                      <FeedCard
                        key={user.user_id || index}
                        image={user.stories && user.stories.length > 0 ? user.stories[0].thumbnail : (user.avatar_url || user.avatar)}
                        username={user.username || user.first_name}
                        isVideo={false}
                        avatar={user.avatar_url || user.avatar}
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
              <CreatePostSection fetchNewFeeds={getNewFeeds} showNotification={showNotification} />
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
              {newFeeds?.map((post) => {
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

                    isLiked={post?.is_liked || likedPosts.has(postId)}
                    isSaved={savedPosts.has(postId)}
                    fetchComments={fetchComments}
                    commentsData={commentsForPost}
                    savePost={savePost}
                    reportPost={reportPost}
                    hidePost={hidePost}
                    commentPost={commentPost}
                    getNewsFeed={getNewFeeds}
                    openImagePopup={openImagePopup}
                    handleReaction={handleReaction}
                    postReaction={postReactions[post?.id]}
                    postReactionCounts={post?.reaction_counts}
                    currentReaction={post?.current_reaction || post?.user_reaction}
                    userReaction={post?.user_reaction}
                  />
                );
              })}

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
                  postReaction={postReactions[post?.id]}
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
                  src={selectedUserForStories.avatar_url || selectedUserForStories.avatar || "/perimg.png"}
                  alt={selectedUserForStories.username || selectedUserForStories.first_name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/perimg.png";
                  }}
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
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ‹
              </button>
            )}

            {/* Next button */}
            {imagePopup.images.length > 1 && (
              <button
                onClick={nextImage}
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

    </>
  );
};

export default Home;