import { useCallback, useEffect, useRef, useState } from 'react';

import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';
import CreatePostSection from '../components/specific/Home/CreatePostSection';
import InfiniteFriendSuggestions from '../components/specific/Home/InfiniteFriendSuggestions';
import PostCard from '../components/specific/Home/PostCard';
import QuickActionsSection from '../components/specific/Home/QuickActionSection';
import StoriesSection from '../components/specific/Home/StoriesSection';
import StoryViewer from '../components/specific/StoryViewer';
import ReportPostModal from '../components/ReportPostModal';
import { dummyFriendSuggestions } from '../constants/friendSuggestions';
import { useUser } from '../context/UserContext';

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
  const [allUsersStories, setAllUsersStories] = useState([]); // All users' stories grouped by user
  const [selectedUserForStories, setSelectedUserForStories] = useState(null);
  const [showStoriesPreview, setShowStoriesPreview] = useState(false);
  const [friendSuggestions, setFriendSuggestions] = useState(dummyFriendSuggestions);

  const [newFeeds, setNewFeeds] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem("liked_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  }); // Track which posts are liked
  const [postComments, setPostComments] = useState({}); // Track comments for each post
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Image popup state
  const [imagePopup, setImagePopup] = useState({ show: false, images: [], currentIndex: 0 });

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingPostId, setReportingPostId] = useState(null);

  const [userLocation, setUserLocation] = useState(null); // Store user location
  const isFetchingRef = useRef(false); // Track if a request is in progress
  const lastFilterRef = useRef(null); // Track the last filter type
  const lastCallTimeRef = useRef(0); // Track the last API call time for debouncing
  const currentFilterRef = useRef(null); // Track current filter for pagination
  const [feedType, setFeedType] = useState('all'); // 'all' or 'following'
  const [activeFilter, setActiveFilter] = useState(null); // Track active filter for UI
  const loadMoreTriggerRef = useRef(null); // Ref for intersection observer
  const [showScrollTop, setShowScrollTop] = useState(false); // Track scroll position for scroll-to-top button

  // Function to get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Ouptel-App' // Required by Nominatim
          }
        }
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      } else if (data && data.address) {
        // Build a more readable address from components
        const addr = data.address;
        const parts = [
          addr.road || addr.street,
          addr.city || addr.town || addr.village,
          addr.state,
          addr.country
        ].filter(Boolean);
        return parts.join(', ');
      }
      
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  // Function to update user location in profile
  const updateUserLocationInProfile = async (address) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/settings/update-user-data`,
        {
          type: "general_settings",
          user_data: JSON.stringify({
            address: address
          })
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      const data = response.data;
      
      if (data.api_status === '200') {
        console.log('Location updated in profile successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating location in profile:', error);
      return false;
    }
  };

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
          async (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);
            localStorage.setItem('user_location', JSON.stringify(location));
            
            // Get and store address
            const address = await getAddressFromCoordinates(location.latitude, location.longitude);
            if (address) {
              localStorage.setItem('user_address', address);
            }
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
          async (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setUserLocation(location);
            localStorage.setItem('user_location', JSON.stringify(location));
            localStorage.setItem('location_permission_requested', 'true');
            
            // Get address from coordinates
            const address = await getAddressFromCoordinates(location.latitude, location.longitude);
            
            if (address) {
              localStorage.setItem('user_address', address);
              
              // Update user profile with location
              const updated = await updateUserLocationInProfile(address);
              
              if (updated) {
                toast.success('Location access granted and saved to your profile!');
              } else {
                toast.success('Location access granted!');
              }
            } else {
              toast.success('Location access granted!');
            }
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

  const getNewFeeds = useCallback(async (type, page = 1, customFeedType = null) => {
    const now = Date.now();

    // Prevent multiple simultaneous API calls
    if (isFetchingRef.current) {
      return;
    }

    // Debounce: Prevent rapid successive calls (within 500ms) - only for first page
    if (page === 1 && now - lastCallTimeRef.current < 500) {
      return;
    }

    // Prevent duplicate calls with the same filter within 1 second - only for first page
    if (page === 1 && lastFilterRef.current === type && (now - lastCallTimeRef.current) < 1000) {
      return;
    }

    try {
      isFetchingRef.current = true;
      if (page === 1) {
      lastFilterRef.current = type;
      lastCallTimeRef.current = now;
        currentFilterRef.current = type;
        setActiveFilter(type); // Set active filter for UI
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      const accessToken = localStorage.getItem("access_token");

      // Determine which feed type to use
      const activeFeedType = customFeedType !== null ? customFeedType : feedType;

      // Build query parameters
      const params = new URLSearchParams();
      params.append('per_page', '10');
      params.append('page', page.toString());

      // Valid filter types: image, file, video, audio, blogs, articles, jobs
      const validFilters = ['image', 'file', 'video', 'audio', 'blogs', 'articles', 'jobs'];

      if (type && validFilters.includes(type)) {
        params.append('filter', type);
      }

      // Choose API endpoint based on feed type
      const apiEndpoint = activeFeedType === 'following' 
        ? `${import.meta.env.VITE_API_URL}/api/v1/people-follow/feed?${params.toString()}`
        : `${import.meta.env.VITE_API_URL}/api/v1/new-feed?${params.toString()}`;

      const response = await axios.get(apiEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.data;

      // Handle new API response structure
      if (data?.data) {
        // Map the data to ensure reactions are properly formatted
        const formattedPosts = data.data.map(post => {
          // Handle reactions object from timeline API (like in Profile.jsx)
          const reactions = post.reactions || {};
          const reactionCounts = reactions.total > 0 ? {
            1: reactions.like || 0,
            2: reactions.love || 0,
            3: reactions.haha || 0,
            4: reactions.wow || 0,
            5: reactions.sad || 0,
            6: reactions.angry || 0
          } : (post.reaction_counts || {});

          return {
            ...post,
            reactions_count: post.reactions_count || reactions.total || 0,
            reaction_counts: reactionCounts,
            user_reaction: reactions.user_reaction || post.user_reaction,
            current_reaction: reactions.user_reaction || post.current_reaction
          };
        });

        if (page === 1) {
          // First page - replace all feeds
          setNewFeeds(formattedPosts);
        } else {
          // Subsequent pages - append to existing feeds
          setNewFeeds(prev => [...prev, ...formattedPosts]);
        }

        // Store pagination metadata
        if (data?.meta?.pagination) {
          setPagination(data.meta.pagination);
        }
      } else if (Array.isArray(data)) {
        // Handle case where response is directly an array
        const formattedPosts = data.map(post => {
          const reactions = post.reactions || {};
          const reactionCounts = reactions.total > 0 ? {
            1: reactions.like || 0,
            2: reactions.love || 0,
            3: reactions.haha || 0,
            4: reactions.wow || 0,
            5: reactions.sad || 0,
            6: reactions.angry || 0
          } : (post.reaction_counts || {});

          return {
            ...post,
            reactions_count: post.reactions_count || reactions.total || 0,
            reaction_counts: reactionCounts,
            user_reaction: reactions.user_reaction || post.user_reaction,
            current_reaction: reactions.user_reaction || post.current_reaction
          };
        });

        if (page === 1) {
          setNewFeeds(formattedPosts);
        } else {
          setNewFeeds(prev => [...prev, ...formattedPosts]);
        }
      } else {
        if (page === 1) {
          setNewFeeds([]);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [feedType]);


  useEffect(() => {
    getNewFeeds();
    getAllUsersStories(); // Fetch all users' stories on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch feeds when feed type changes
  useEffect(() => {
    getNewFeeds(currentFilterRef.current, 1, feedType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType]);

  // Infinite scroll handler using Intersection Observer
  useEffect(() => {
    // Don't setup observer if there's no trigger element
    if (!loadMoreTriggerRef.current) {
      return;
    }

    // Create new observer
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        
        // When the trigger element is visible
        if (target.isIntersecting) {
          console.log('Load more trigger visible', {
            pagination,
            loadingMore,
            isFetching: isFetchingRef.current,
            currentFilter: currentFilterRef.current,
            feedType
          });
          
          // Check if there are more pages to load
          if (
            pagination &&
            pagination.has_more &&
            pagination.current_page < pagination.last_page &&
            !loadingMore &&
            !isFetchingRef.current
          ) {
            const nextPage = pagination.current_page + 1;
            console.log('Loading next page:', nextPage, {
              currentPage: pagination.current_page,
              lastPage: pagination.last_page,
              hasMore: pagination.has_more,
              filter: currentFilterRef.current
            });
            getNewFeeds(currentFilterRef.current, nextPage, feedType);
          }
        }
      },
      {
        root: null, // viewport
        rootMargin: '200px', // Start loading 200px before reaching the element
        threshold: 0.1
      }
    );

    // Observe the trigger element
    const currentTrigger = loadMoreTriggerRef.current;
    if (currentTrigger) {
      console.log('Observing load more trigger');
      observer.observe(currentTrigger);
    }

    // Cleanup function
    return () => {
      if (observer && currentTrigger) {
        observer.unobserve(currentTrigger);
      }
      observer?.disconnect();
    };
  }, [pagination, loadingMore, getNewFeeds, feedType, newFeeds.length]); // Added newFeeds.length to re-trigger when posts are loaded

  const posts = [];

  const followUser = useCallback(async (user_id) => {
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      // formData.append('action', 'follow');
      formData.append('user_id', user_id);
      const response = await fetch(`https://ouptel.com/api/follow-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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
    // This function is kept for backward compatibility but uses data from feed
    // The actual like action should use handleReaction instead
    const post = newFeeds.find(p => p.id === post_id);
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

      // Update the like count in newFeeds based on current state
      setNewFeeds(prev =>
        prev.map(p =>
          p.id === post_id
            ? {
              ...p,
              reactions_count: wasLiked
                ? Math.max(0, parseInt(p.reactions_count || p.post_likes || 0) - 1)
                : parseInt(p.reactions_count || p.post_likes || 0) + 1,
              is_liked: !wasLiked
            }
            : p
        )
      );
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
    try {
      const accessToken = localStorage.getItem("access_token");
      
      // Find the current saved state from the post in newFeeds
      const post = newFeeds.find(p => p.id === post_id || p.post_id === post_id);
      const wasSaved = post?.is_saved || post?.is_post_saved || false;

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
        // Get the new saved state from API response
        const newSavedState = data?.data?.is_saved !== undefined ? data.data.is_saved : !wasSaved;
        
        // Update the saved state in newFeeds - check both id and post_id
        setNewFeeds(prev =>
          prev.map(p => {
            const matchesPost = p.id === post_id || p.post_id === post_id;
            return matchesPost
              ? { ...p, is_saved: newSavedState, is_post_saved: newSavedState }
              : p;
          })
        );
        
        // Show success message
        toast.success(data?.message || (newSavedState ? 'Post saved successfully' : 'Post unsaved successfully'));
      } else {
        toast.error(data?.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error?.response?.data?.message || 'Error saving post');
    }
  }

  const reportPost = async (post_id) => {
    setReportingPostId(post_id);
    setShowReportModal(true);
  };

  const handleReportSubmit = async (reason, text) => {
    if (!reportingPostId) return;
    
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/posts/${reportingPostId}/report`,
        {
          reason: reason,
          text: text
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );
      
      const data = response.data;
      if (data?.ok === true || data?.api_status === 200) {
        toast.success(data?.message || 'Post reported successfully');
        setShowReportModal(false);
        setReportingPostId(null);
      } else {
        toast.error(data?.message || 'Failed to report post');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      const errorMsg = error?.response?.data?.message || 'Error reporting post';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
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

        // Refetch the news feed to get updated data
        await getNewFeeds();
      } else {
        // Handle error response from API
        const errorMessage = data?.message || 'Failed to add reaction';
        toast.error(errorMessage);
        console.error('Reaction failed:', data);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Error adding reaction';
      toast.error(errorMessage);
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

  const handlePollVote = async (postId, optionId) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/polls/vote`,
        {
          id: optionId
        },
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
        // Update the poll data in newFeeds
        setNewFeeds(prev =>
          prev.map(post => {
            if (post.id === postId) {
              // Use updated poll options from API if available
              const updatedOptions = data?.data?.poll_options || data?.poll_options;

              if (updatedOptions && Array.isArray(updatedOptions)) {
                // Calculate percentages for all options
                const totalVotes = updatedOptions.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                const optionsWithPercentages = updatedOptions.map(opt => ({
                  ...opt,
                  percentage: totalVotes > 0 ? ((opt.votes || 0) / totalVotes) * 100 : 0
                }));

                return {
                  ...post,
                  poll_options: optionsWithPercentages
                };
              } else {
                // Fallback: manually update the selected option and recalculate
                const updatedPollOptions = post.poll_options?.map(opt => {
                  if (opt.id === optionId) {
                    return { ...opt, is_voted: true, votes: (opt.votes || 0) + 1 };
                  }
                  return opt;
                });

                // Recalculate percentages
                if (updatedPollOptions) {
                  const totalVotes = updatedPollOptions.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                  const optionsWithPercentages = updatedPollOptions.map(opt => ({
                    ...opt,
                    percentage: totalVotes > 0 ? ((opt.votes || 0) / totalVotes) * 100 : 0
                  }));

                  return {
                    ...post,
                    poll_options: optionsWithPercentages
                  };
                }
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

    // Handle video posts with post_file_url (NEW API - HIGHEST PRIORITY for video)
    if (post?.post_type === 'video' && post?.post_file_url) {
      return { video: ensureFullUrl(post.post_file_url), postType: 'video' };
    }

    // Handle video posts with post_video_url
    if (post?.post_video_url) {
      return { video: ensureFullUrl(post.post_video_url), postType: 'video' };
    }

    // Handle audio posts with post_record_url (HIGHEST PRIORITY for audio)
    if (post?.post_record_url) {
      // Check if it's an audio file by URL pattern or post_type
      const isAudio = post?.post_type === 'audio' ||
        post?.post_record_url.includes('/audio/') ||
        post?.post_record_url.includes('/sounds/') ||
        /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record_url);

      if (isAudio) {
        return { audio: ensureFullUrl(post.post_record_url), postType: 'audio' };
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
        return { audio: ensureFullUrl(post.post_record), postType: 'audio' };
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
        hasMultipleImages: processedImages.length > 1,
        postType: 'image'
      };
    }

    // Handle new API single post_photo_url
    if (post?.post_photo_url) {
      return { image: ensureFullUrl(post.post_photo_url), postType: 'image' };
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
        hasMultipleImages: processedImages.length > 1,
        postType: 'image'
      };
    }

    // Handle single image from postPhoto (LEGACY)
    if (post?.postPhoto) {
      return { image: ensureFullUrl(post.postPhoto), postType: 'image' };
    }

    // Handle file attachments using post_file_url (NEW API)
    if (post?.post_file_url) {
      const url = ensureFullUrl(post.post_file_url);
      const fileName = post.post_file || '';
      const ext = fileName.split('.').pop()?.toLowerCase() || '';

      // More comprehensive detection
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff", "tif"];
      const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "m4v"];
      const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "wma", "m4a"];

      // Check if URL contains patterns
      const urlLooksLikeImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|tif)/i.test(url) ||
        url.includes('image') ||
        url.includes('photo');

      const urlLooksLikeVideo = /\.(mp4|mov|avi|mkv|webm|flv|wmv|m4v)/i.test(url) ||
        url.includes('video') ||
        url.includes('posts/videos');

      const urlLooksLikeAudio = /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(url) ||
        url.includes('audio') ||
        url.includes('sound') ||
        url.includes('posts/audio');

      if (imageExtensions.includes(ext) || urlLooksLikeImage) {
        return { image: url, postType: 'image' };
      } else if (videoExtensions.includes(ext) || urlLooksLikeVideo) {
        return { video: url, postType: 'video' };
      } else if (audioExtensions.includes(ext) || urlLooksLikeAudio) {
        return { audio: url, postType: 'audio' };
      }
      // Only show file download for non-media files
      else if (!imageExtensions.includes(ext) && !videoExtensions.includes(ext) && !audioExtensions.includes(ext)) {
        return { 
          file: url,
          postfile: url,
          postFileName: fileName,
          postType: 'file'
        };
      }
    }

    // Handle file attachments - but prioritize image detection (LEGACY)
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
        return { image: url, postType: 'image' };
      } else if (videoExtensions.includes(ext)) {
        return { video: url, postType: 'video' };
      } else if (audioExtensions.includes(ext) || urlLooksLikeAudio) {
        return { audio: url, postType: 'audio' };
      }
      // Only show file download for non-media files
      else if (!imageExtensions.includes(ext) && !videoExtensions.includes(ext) && !audioExtensions.includes(ext)) {
        return { file: url, postType: 'file' };
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
      const response = await fetch(`https://ouptel.com/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${accessToken}`
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
    // This API endpoint has been removed - using dummy data instead
    setFriendSuggestions(dummyFriendSuggestions);
  }

  const getuserStories = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      // formData.append('type', 'get');
      const response = await fetch(`https://ouptel.com/api/get-user-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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

  // Fetch all users' stories for the Vibe section
  const getAllUsersStories = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/stories/user-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          limit: 20,
          offset: 0
        }),
      });

      const data = await response.json();

      if (data?.api_status === 200 && data?.stories && Array.isArray(data.stories)) {
        // The user-stories API already returns stories grouped by user with the correct structure
        // Each item has: user_id, username, name, avatar, avatar_url, verified, stories[]
        setAllUsersStories(data.stories);
      } else {
        setAllUsersStories([]);
      }
    } catch (error) {
      console.error('Error fetching all users stories:', error);
      setAllUsersStories([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format timestamp to time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';

    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };



  const handleStoryClick = (user) => {
    setSelectedUserForStories(user);
    setShowStoriesPreview(true);
  };



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
        <div className="max-w-7xl mx-auto px-1 md:px-1 py-2 md:py-3">
          <div className="mb-2 md:mb-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3 px-1 md:px-2">Vibe</h2>
            <div className="px-1 md:px-2">
              <StoriesSection
                userStories={allUsersStories}
                onStoryClick={handleStoryClick}
                onStoryCreated={() => {
                  getuserStories();
                  getAllUsersStories();
                }}
                currentUserId={localStorage.getItem('user_id')}
              />
            </div>
          </div>

          <div className="px-1 md:px-2 relative">
            <div className='mb-3 md:mb-4'>
              <CreatePostSection fetchNewFeeds={getNewFeeds} showNotification={showNotification} />
            </div>

            {/* Fixed sticky positioning issue */}
            <div className="sticky top-0 z-30 bg-[#EDF6F9] py-2 -mx-1 md:-mx-2">
              <div className="mx-1 md:mx-2 space-y-2">
                {/* Feed Type Filter */}
                <div className="bg-transparent rounded-2xl py-1 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setFeedType('all')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                        feedType === 'all'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={() => setFeedType('following')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                        feedType === 'following'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-white text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Following
                    </button>
                  </div>
                </div>
                <QuickActionsSection fetchNewFeeds={getNewFeeds} activeFilter={activeFilter} />
              </div>
            </div>

            <div className="mb-2 md:mb-3 mt-2">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Friend Suggestions</h2>
              <InfiniteFriendSuggestions
                friendSuggestions={friendSuggestions}
                // onAddFriend={followUser}
                followedUsers={followedUsers}
              />
            </div>

            <div className="mb-3 md:mb-4 mt-3 flex flex-col gap-3 md:gap-3 smooth-content-transition ">
              {newFeeds?.map((post) => {
                const postId = post?.id || post?.post_id;
                const commentsForPost = postComments[postId] || [];
                const fileProps = getFileTypeProps(post);
                
                // Handle reactions object from API (like in Profile.jsx)
                const reactions = post?.reactions || {};
                const reactionCounts = reactions.total > 0 ? {
                  1: reactions.like || 0,
                  2: reactions.love || 0,
                  3: reactions.haha || 0,
                  4: reactions.wow || 0,
                  5: reactions.sad || 0,
                  6: reactions.angry || 0
                } : (post?.reaction_counts || {});
                
                return (
                  <PostCard
                    key={post?.id || postId}
                    id={post?.id || postId}
                    post_id={post?.post_id || postId}

                    user={post?.author || post?.publisher}
                    content={post?.post_text || post?.postText}
                    blog={post?.blog}
                    iframelink={post?.post_youtube || post?.postYoutube}
                    postfile={post?.post_file || post?.postFile}
                    postFileName={post?.postFileName}
                    {...fileProps}
                    likes={post?.reactions_count || reactions.total || post?.post_likes || 0}
                    comments={post?.comments_count || post?.post_comments}
                    shares={post?.shares_count || post?.post_shares}
                    saves={post?.is_post_saved}
                    timeAgo={post?.created_at_human || post?.post_created_at}
                    handleLike={handleLike}

                    isLiked={post?.is_liked || likedPosts.has(postId)}
                    isSaved={post?.is_saved || post?.is_post_saved || false}
                    fetchComments={fetchComments}
                    commentsData={commentsForPost}
                    savePost={savePost}
                    reportPost={reportPost}
                    hidePost={hidePost}
                    commentPost={commentPost}
                    getNewsFeed={getNewFeeds}
                    openImagePopup={openImagePopup}
                    handleReaction={handleReaction}
                    postReaction={reactions.user_reaction || post?.user_reaction || post?.current_reaction}
                    postReactionCounts={reactionCounts}
                    currentReaction={reactions.user_reaction || post?.current_reaction || post?.user_reaction}
                    userReaction={reactions.user_reaction || post?.user_reaction}
                    postType={fileProps?.postType || post?.post_type}
                    pollOptions={post?.poll_options}
                    handlePollVote={(optionId) => handlePollVote(postId, optionId)}
                    isPollLoading={loading}
                    colorId={post?.color_id}
                    colorData={post?.color_data || post?.color}
                    feeling={post?.feeling}
                    isFeelingPost={post?.is_feeling_post}
                    likedUsers={post?.liked_users || []}
                    activity={post?.activity}
                  />
                );
              })}

              {/* Loading More Indicator */}
              {loadingMore && (
                <div className="flex justify-center items-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">Loading more posts...</span>
                  </div>
                </div>
              )}

              {/* Intersection Observer Trigger - This element triggers loading more posts */}
              {pagination && pagination.has_more && !loadingMore && (
                <div 
                  ref={loadMoreTriggerRef} 
                  className="h-20 flex items-center justify-center"
                >
                  <div className="text-gray-400 text-sm">
                    Scroll for more... (Page {pagination.current_page} of {pagination.last_page})
                  </div>
                </div>
              )}

              {/* End of Feed Message */}
              {pagination && !pagination.has_more && newFeeds.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">You've reached the end of the feed</p>
                </div>
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
                  postReaction={null}
                  reportPost={reportPost}
                  hidePost={hidePost}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stories Viewer for Other Users */}
      {showStoriesPreview && selectedUserForStories && selectedUserForStories.stories && selectedUserForStories.stories.length > 0 && (
        <StoryViewer
          isOpen={showStoriesPreview}
          onClose={() => {
            setShowStoriesPreview(false);
            setSelectedUserForStories(null);
          }}
          stories={selectedUserForStories.stories}
          currentUser={{
            name: `${selectedUserForStories.first_name || ''} ${selectedUserForStories.last_name || ''}`.trim() || selectedUserForStories.username,
            username: selectedUserForStories.username,
            avatar_url: selectedUserForStories.avatar_url || selectedUserForStories.avatar,
            user_id: selectedUserForStories.user_id || selectedUserForStories.id
          }}
          isCurrentUserStories={(selectedUserForStories.user_id || selectedUserForStories.id)?.toString() === localStorage.getItem('user_id')?.toString()}
          onStoryDeleted={() => {
            // Refresh stories after deletion
            getuserStories();
            getAllUsersStories();
          }}
          allUserStories={(() => {
            const currentUserId = localStorage.getItem('user_id');
            // Filter out current user's stories from the list for navigation
            const filteredStories = allUsersStories.filter(u => (u.user_id || u.id)?.toString() !== currentUserId?.toString());
            return filteredStories;
          })()}
          initialUserIndex={(() => {
            const currentUserId = localStorage.getItem('user_id');
            const filteredStories = allUsersStories.filter(u => (u.user_id || u.id)?.toString() !== currentUserId?.toString());
            return filteredStories.findIndex(u => (u.user_id || u.id)?.toString() === (selectedUserForStories.user_id || selectedUserForStories.id)?.toString());
          })()}
        />
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

      {/* Report Post Modal */}
      <ReportPostModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportingPostId(null);
        }}
        onSubmit={handleReportSubmit}
        isLoading={loading}
      />

    </>
  );
};

export default Home;