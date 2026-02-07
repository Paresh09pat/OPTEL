import axios from 'axios';
import { Bookmark, ChevronDown, ChevronUp, MessageCircle, MoreHorizontal, Smile, ThumbsUp, X } from 'lucide-react';
import { memo, useCallback, useEffect, useState, useRef } from 'react';
import { FaFilePdf, FaPaperPlane } from 'react-icons/fa';
import { IoBookmark } from "react-icons/io5";
import { IoMdShare } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '../../../context/UserContext';
import { baseUrl } from '../../../utils/constant';
import Avatar from '../../Avatar';
import SharePopup from './SharePopup';
import Poll from './Poll';
import ReactionDetailsModal from './ReactionDetailsModal';
import ReportPostModal from '../../ReportPostModal';
import DeletePostModal from './DeletePostModal';
const PostCard = ({ id, user, content, image, video, audio, file, likes, comments, shares, saves, timeAgo, post_id, handleLike, handleDislike, isLiked, commentsData, savePost, isSaved, blog, multipleImages, hasMultipleImages, reportPost, hidePost, iframelink, postfile, postFileName, getNewsFeed, openImagePopup, handleReaction, postReaction, postReactionCounts, currentReaction, userReaction, postType, pollOptions, handlePollVote, isPollLoading, colorId, colorData, feeling, isFeelingPost, likedUsers }) => {
  // Use id as the primary identifier for most operations (comments, reactions, etc.)
  // Use post_id for post-specific operations (delete post, hide post, etc.)
  const postIdentifier = id || post_id;
  const postIdForPostOperations = post_id || id;
  
  console.log('PostCard IDs:', { id, post_id, postIdentifier, postIdForPostOperations });
  const navigate = useNavigate();
  const { userData } = useUser();
  const [clickedComments, setClickedComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [localCommentsData, setLocalCommentsData] = useState(commentsData || []);
  const [showAllComments, setShowAllComments] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Add state for reply functionality
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyInput, setReplyInput] = useState('');
  // Add state for storing replies for each comment
  const [commentReplies, setCommentReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  // Add state for tracking comment like/dislike loading states
  const [commentActionLoading, setCommentActionLoading] = useState({});
  // Add state for managing edit mode
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  // Add state for managing reply edit mode
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [showReactionPopup, setShowReactionPopup] = useState(false);

  // New states for reaction details modal
  const [showReactionDetailsModal, setShowReactionDetailsModal] = useState(false);
  const [reactionDetails, setReactionDetails] = useState(null);
  const [isLoadingReactionDetails, setIsLoadingReactionDetails] = useState(false);
  // Add state for emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState({});
  const [showEditCommentEmojiPicker, setShowEditCommentEmojiPicker] = useState({});
  const [showEditReplyEmojiPicker, setShowEditReplyEmojiPicker] = useState({});
  const emojiPickerRef = useRef(null);
  // Add ref to preserve comments open state during deletion
  const keepCommentsOpenRef = useRef(false);
  // Add ref to prevent prop updates from overwriting local state during refetch
  const isRefetchingRef = useRef(false);
  // Add state for comment reaction popups
  const [showCommentReactionPopup, setShowCommentReactionPopup] = useState({});
  const [commentHoverTimeouts, setCommentHoverTimeouts] = useState({});
  // Add state for video playing
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
  // Add state for video mute
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  // Add state for video progress
  const [videoProgress, setVideoProgress] = useState(0);
  // Add state for image slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Add state for report modal
  const [showReportModal, setShowReportModal] = useState(false);
  // Add state for delete post modal
  const [showDeletePostModal, setShowDeletePostModal] = useState(false);
  // Add state for delete reply modal
  const [showDeleteReplyModal, setShowDeleteReplyModal] = useState(false);
  const [replyToDelete, setReplyToDelete] = useState(null);
  // Add local state for saved status to provide instant visual feedback
  const [localIsSaved, setLocalIsSaved] = useState(isSaved);
  
  const buildAuthHeaders = useCallback(() => {
    const accessToken = localStorage.getItem("access_token");
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
  }, []);

  // Update local saved state when prop changes
  useEffect(() => {
    setLocalIsSaved(isSaved);
  }, [isSaved]);

  // Reset image slider when post changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [post_id]);

  // Image slider navigation handlers
  const handlePrevImage = useCallback((e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? multipleImages.length - 1 : prev - 1);
  }, [multipleImages]);

  const handleNextImage = useCallback((e) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === multipleImages.length - 1 ? 0 : prev + 1);
  }, [multipleImages]);

  const handleDotClick = useCallback((index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  }, []);

  const findParentCommentId = useCallback((replyId) => {
    const normalizedReplyId = Number(replyId);
    for (const [commentId, replies] of Object.entries(commentReplies)) {
      if (Array.isArray(replies) && replies.some((reply) => Number(reply.id) === normalizedReplyId || Number(reply.reply_id) === normalizedReplyId)) {
        return Number(commentId);
      }
    }
    return null;
  }, [commentReplies]);
  // Update local comments when prop changes
  // But don't overwrite if we're in the middle of a refetch (to preserve optimistic updates)
  useEffect(() => {
    if (!isRefetchingRef.current && commentsData && Array.isArray(commentsData)) {
      setLocalCommentsData(commentsData);
      
      // If comments have replies in them, populate commentReplies state
      const repliesMap = {};
      commentsData.forEach(comment => {
        if (comment.has_replies && comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0) {
          repliesMap[comment.id] = comment.replies;
        }
      });
      if (Object.keys(repliesMap).length > 0) {
        setCommentReplies(prev => ({ ...prev, ...repliesMap }));
      }
    }
  }, [commentsData]);

  // Restore comments open state if it was preserved during deletion
  useEffect(() => {
    if (keepCommentsOpenRef.current && !clickedComments) {
      setClickedComments(true);
    }
  }, [clickedComments]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
      // Cleanup comment hover timeouts
      Object.values(commentHoverTimeouts).forEach(timeout => {
        if (timeout) {
          clearTimeout(timeout);
        }
      });
    };
  }, [hoverTimeout, commentHoverTimeouts]);

  // Add click outside handler
  useEffect(() => {
    if (showReactionPopup) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showReactionPopup]);

  // Add click outside handler for comment reaction popups
  useEffect(() => {
    const handleCommentReactionClickOutside = (event) => {
      if (!event.target.closest('[data-comment-reaction-popup]') && !event.target.closest('[data-comment-reaction-button]')) {
        setShowCommentReactionPopup({});
      }
    };

    if (Object.keys(showCommentReactionPopup).length > 0) {
      document.addEventListener('mousedown', handleCommentReactionClickOutside);
      return () => document.removeEventListener('mousedown', handleCommentReactionClickOutside);
    }
  }, [showCommentReactionPopup]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      const commentsSection = event.target.closest('[data-comments-section]');
      if (!commentsSection) {
        setClickedComments(false);
        keepCommentsOpenRef.current = false; // User closed by clicking outside
      }
    };

    if (clickedComments) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clickedComments]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const optionsMenu = event.target.closest('[data-options-menu]');
      const threeDotsButton = event.target.closest('[data-three-dots-button]');

      if (!optionsMenu && !threeDotsButton) {
        setShowOptionsMenu(false);
      }
    };

    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      // Also close on escape key
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setShowOptionsMenu(false);
        }
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showOptionsMenu]);

  // Close share popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sharePopup = event.target.closest('[data-share-popup]');
      const shareButton = event.target.closest('[data-share-button]');

      if (!sharePopup && !shareButton) {
        setShowSharePopup(false);
      }
    };

    if (showSharePopup) {
      document.addEventListener('mousedown', handleClickOutside);
      // Also close on escape key
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setShowSharePopup(false);
        }
      };
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showSharePopup]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const emojiButton = event.target.closest('[data-emoji-button]');
      const emojiPicker = event.target.closest('[data-emoji-picker]');

      if (!emojiButton && !emojiPicker) {
        setShowEmojiPicker(false);
        setShowReplyEmojiPicker({});
        setShowEditCommentEmojiPicker({});
        setShowEditReplyEmojiPicker({});
      }
    };

    if (showEmojiPicker || Object.keys(showReplyEmojiPicker).length > 0 || 
        Object.keys(showEditCommentEmojiPicker).length > 0 || 
        Object.keys(showEditReplyEmojiPicker).length > 0) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showEmojiPicker, showReplyEmojiPicker, showEditCommentEmojiPicker, showEditReplyEmojiPicker]);

  const fetchPostComments = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setIsLoadingComments(true);
    }
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/posts/${postIdentifier}/comments?per_page=20&include_replies=true&include_replies_data=true`,
        {
          // params: { per_page: 20 },
          headers: buildAuthHeaders()
        }
      );
      const data = response.data;
      if (data?.ok === true) {
        // Handle different API response structures
        const fetched =
          (Array.isArray(data?.data?.comments) && data.data.comments) ||
          (Array.isArray(data?.data?.data) && data.data.data) ||
          (Array.isArray(data?.data) && data.data) ||
          (Array.isArray(data?.comments) && data.comments) ||
          [];
        if (Array.isArray(fetched)) {
          setLocalCommentsData(fetched);
          
          // If comments have replies in them, populate commentReplies state
          const repliesMap = {};
          fetched.forEach(comment => {
            if (comment.has_replies && comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0) {
              repliesMap[comment.id] = comment.replies;
            }
          });
          if (Object.keys(repliesMap).length > 0) {
            setCommentReplies(prev => ({ ...prev, ...repliesMap }));
          }
          
          return fetched;
        } else {
          console.warn('Fetched comments is not an array:', fetched);
          // Don't overwrite existing comments if fetch returns invalid data
          return null;
        }
      } else {
        console.log('Failed to fetch comments:', data);
        // Don't overwrite existing comments on API error
        return null;
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Don't overwrite existing comments on network error
      return null;
    } finally {
      if (showLoader) {
        setIsLoadingComments(false);
      }
    }
  }, [postIdentifier, buildAuthHeaders]);

  const fetchReactionDetails = useCallback(async () => {
    setIsLoadingReactionDetails(true);
    setShowReactionDetailsModal(true);
    
    console.log('PostCard - fetchReactionDetails called');
    console.log('PostCard - likedUsers prop:', likedUsers);
    console.log('PostCard - postReactionCounts:', postReactionCounts);
    console.log('PostCard - Total reaction count:', getTotalReactionCount());
    
    // Use the liked_users data that's already available from the post
    const reactionData = {
      reaction_counts: postReactionCounts || {},
      total_reactions: getTotalReactionCount(),
      liked_users: likedUsers || [] // Use the prop passed from parent
    };
    
    console.log('PostCard - Reaction data being set:', reactionData);
    
    // Set the data immediately - no need to fetch again
    setReactionDetails(reactionData);
    setIsLoadingReactionDetails(false);
  }, [postIdentifier, postReactionCounts, likedUsers]);

  const handleClickComments = useCallback(async () => {
    try {
      if (!clickedComments) {
        await fetchPostComments(true);
        keepCommentsOpenRef.current = true; // User opened comments
      } else {
        keepCommentsOpenRef.current = false; // User closed comments manually
      }
      setClickedComments(!clickedComments);
    } catch (error) {
      console.error('Error toggling comments:', error);
    }
  }, [clickedComments, fetchPostComments]);

  const toggleShowAllComments = useCallback(() => {
    setShowAllComments(!showAllComments);
  }, [showAllComments]);

  const handleLikeClick = useCallback(() => {
    // Always show popup on click to allow reaction selection
    setShowReactionPopup(true);
  }, []);

  const handleDislikeClick = useCallback(() => {
    handleDislike(postIdentifier);
  }, [handleDislike, postIdentifier]);

  // Get reaction emoji based on reaction type
  const getReactionEmoji = (reactionType) => {
    const reactions = {
      1: '👍', // Thumbs up
      2: '❤️', // Heart
      3: '😂', // Haha
      4: '😮', // Wow
      5: '😢', // Sad
      6: '😡'  // Angry
    };
    return reactions[reactionType] || '👍';
  };

  // Get reaction label based on reaction type
  const getReactionLabel = (reactionType) => {
    const labels = {
      1: 'Liked',
      2: 'Loved',
      3: 'Haha',
      4: 'Wow',
      5: 'Sad',
      6: 'Angry'
    };
    return labels[reactionType] || 'Liked';
  };

  // Get feeling emoji based on feeling key
  const getFeelingEmoji = (feelingKey) => {
    const feelings = {
      'happy': '😊',
      'loved': '😍',
      'sad': '😢',
      'angry': '😠',
      'confused': '😕',
      'hot': '🥵',
      'broken': '💔',
      'expressionless': '😑',
      'cool': '😎',
      'funny': '😄',
      'tired': '😫',
      'lovely': '🥰',
      'blessed': '🙏',
      'shocked': '😲',
      'sleepy': '😴',
      'pretty': '😊',
      'bored': '😒'
    };
    return feelings[feelingKey] || '😊';
  };

  // Get activity emoji and label based on post type
  const getActivityInfo = (postType, postText) => {
    const activities = {
      'traveling': { emoji: '✈️', label: 'Traveling to', prefix: 'traveling to' },
      'watching': { emoji: '📺', label: 'Watching', prefix: 'watching' },
      'listening': { emoji: '🎵', label: 'Listening to', prefix: 'listening to' },
      'playing': { emoji: '🎮', label: 'Playing', prefix: 'playing' },
      'reading': { emoji: '📖', label: 'Reading', prefix: 'reading' },
      'reaction': { emoji: '💭', label: 'Reacted', prefix: '' }
    };
    
    const activity = activities[postType];
    if (!activity) return null;
    
    // Extract the activity target from post text (e.g., "Traveling to India" -> "India")
    let target = postText || '';
    if (activity.prefix && postText) {
      const regex = new RegExp(`^${activity.prefix}\\s+(.+)`, 'i');
      const match = postText.match(regex);
      if (match && match[1]) {
        target = match[1].split('\n')[0].trim(); // Get first line after prefix
      }
    }
    
    return { ...activity, target };
  };

  // Get total reaction count - use likes prop which contains reactions_count from API
  const getTotalReactionCount = () => {
    // If postReactionCounts exists, calculate from it (for detailed breakdown)
    // Otherwise, use likes prop which already contains reactions_count from /new-feed API
    if (postReactionCounts && Object.keys(postReactionCounts).length > 0) {
      return Object.values(postReactionCounts).reduce((sum, count) => sum + count, 0);
    }
    // Use likes prop which contains reactions_count from the feed API
    return likes || 0;
  };

  // Handle hover with delay to prevent glitch
  const handleLikeButtonMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    const timeout = setTimeout(() => {
      setShowReactionPopup(true);
    }, 300); // Increased delay to prevent accidental showing
    setHoverTimeout(timeout);
  };

  const handleLikeButtonMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Only hide if not hovering over popup
    setTimeout(() => {
      if (!showReactionPopup) {
        setShowReactionPopup(false);
      }
    }, 100);
  };

  const handlePopupMouseEnter = () => {
    // Keep popup open when hovering over it
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handlePopupMouseLeave = () => {
    // Hide popup when leaving the popup area
    setShowReactionPopup(false);
  };

  const handleReactionClick = (reactionType) => {
    handleReaction(postIdentifier, reactionType);
    setShowReactionPopup(false);
  };

  // Comment reaction handlers
  const handleCommentReactionButtonClick = useCallback((commentId) => {
    setShowCommentReactionPopup(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  }, []);

  const handleCommentReactionButtonMouseEnter = useCallback((commentId) => {
    // Clear any existing timeout for this comment
    if (commentHoverTimeouts[commentId]) {
      clearTimeout(commentHoverTimeouts[commentId]);
    }

    const timeout = setTimeout(() => {
      setShowCommentReactionPopup(prev => ({ ...prev, [commentId]: true }));
    }, 300);
    setCommentHoverTimeouts(prev => ({ ...prev, [commentId]: timeout }));
  }, [commentHoverTimeouts]);

  const handleCommentReactionButtonMouseLeave = useCallback((commentId) => {
    if (commentHoverTimeouts[commentId]) {
      clearTimeout(commentHoverTimeouts[commentId]);
      setCommentHoverTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[commentId];
        return newTimeouts;
      });
    }
    setTimeout(() => {
      if (!showCommentReactionPopup[commentId]) {
        setShowCommentReactionPopup(prev => {
          const newPopups = { ...prev };
          delete newPopups[commentId];
          return newPopups;
        });
      }
    }, 100);
  }, [commentHoverTimeouts, showCommentReactionPopup]);

  const handleCommentReactionPopupMouseEnter = useCallback((commentId) => {
    if (commentHoverTimeouts[commentId]) {
      clearTimeout(commentHoverTimeouts[commentId]);
      setCommentHoverTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[commentId];
        return newTimeouts;
      });
    }
  }, [commentHoverTimeouts]);

  const handleCommentReactionPopupMouseLeave = useCallback((commentId) => {
    setShowCommentReactionPopup(prev => {
      const newPopups = { ...prev };
      delete newPopups[commentId];
      return newPopups;
    });
  }, []);


  const handleClickOutside = (e) => {
    // Hide popup when clicking outside
    if (showReactionPopup && !e.target.closest('[data-reaction-popup]')) {
      setShowReactionPopup(false);
    }
    // Hide comment reaction popups when clicking outside
    if (!e.target.closest('[data-comment-reaction-popup]') && !e.target.closest('[data-comment-reaction-button]')) {
      setShowCommentReactionPopup({});
    }
  };

  const toggleOptionsMenu = useCallback(() => {
    setShowOptionsMenu(!showOptionsMenu);
  }, [showOptionsMenu]);

  const toggleSharePopup = useCallback(() => {
    setShowSharePopup(!showSharePopup);
  }, [showSharePopup]);

  const handleSavePost = useCallback(() => {
    // Toggle local state immediately for instant visual feedback
    setLocalIsSaved(prev => !prev);
    savePost(postIdForPostOperations);
    setShowOptionsMenu(false);
  }, [savePost, postIdForPostOperations]);

  const handleReportPost = useCallback(async () => {
    setShowOptionsMenu(false);
    setShowReportModal(true);
  }, []);

  const handleReportSubmit = useCallback(async (reason, text) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/${postIdForPostOperations}/report`,
        {
          reason: reason,
          text: text
        },
        {
          headers: buildAuthHeaders()
        }
      );
      
      const data = response.data;
      if (data?.ok === true || data?.api_status === 200) {
        toast.success(data?.message || 'Post reported successfully');
        setShowReportModal(false);
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
  }, [postIdForPostOperations, buildAuthHeaders]);

  const handleOpenInNewTab = useCallback(() => {
    window.open(`/post/${postIdentifier}`, '_blank');
    setShowOptionsMenu(false);
  }, [postIdentifier]);

  const handleHidePost = useCallback(async () => {
    setShowOptionsMenu(false);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/hide`,
        { post_id: postIdentifier },
        {
          headers: buildAuthHeaders()
        }
      );
      const data = response.data;
      if (data?.api_status === 200 || data?.ok === true) {
        // Show a more user-friendly success message
        toast.success('Post hidden successfully! You won\'t see this post in your feed anymore.');
        // Refetch the news feed to update the UI
        if (getNewsFeed && typeof getNewsFeed === 'function') {
          getNewsFeed();
        }
      } else {
        toast.error(data?.message || 'Failed to hide post');
      }
    } catch (error) {
      console.error('Error hiding post:', error);
      const errorMsg = error?.response?.data?.message || 'Error hiding post';
      toast.error(errorMsg);
    }
  }, [postIdentifier, buildAuthHeaders, getNewsFeed]);

  const handleDeletePost = useCallback(async () => {
    setShowOptionsMenu(false);
    setShowDeletePostModal(false);
    
    setLoading(true);
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/posts/${postIdForPostOperations}`,
        {
          headers: buildAuthHeaders()
        }
      );
      const data = response.data;
      if (data?.api_status === 200 || data?.ok === true) {
        toast.success('Post deleted successfully');
        // Refetch the news feed to update the UI
        if (getNewsFeed && typeof getNewsFeed === 'function') {
          getNewsFeed();
        }
      } else {
        toast.error(data?.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      const errorMsg = error?.response?.data?.message || 'Error deleting post';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [postIdForPostOperations, buildAuthHeaders, getNewsFeed]);

  const handleDeletePostClick = useCallback(() => {
    setShowOptionsMenu(false);
    setShowDeletePostModal(true);
  }, []);

  const handleShareToTimeline = useCallback(() => {
    console.log('Share to timeline:', postIdentifier);
    // Don't close popup
  }, [postIdentifier]);

  const handleShareToPage = useCallback(() => {
    console.log('Share to page:', postIdentifier);
    // Don't close popup
  }, [postIdentifier]);

  const handleShareToGroup = useCallback(() => {
    console.log('Share to group:', postIdentifier);
    // Don't close popup
  }, [postIdentifier]);

  const handleSocialShare = useCallback((platform) => {
    const postUrl = `${window.location.origin}/post/${postIdentifier}`;
    const postText = content || 'Check out this post!';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        // For mobile, use whatsapp:// protocol, for desktop use web.whatsapp.com
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
          shareUrl = `whatsapp://send?text=${encodeURIComponent(postText + ' ' + postUrl)}`;
        } else {
          shareUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(postText + ' ' + postUrl)}`;
        }
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      case 'copy':
        // Copy to clipboard
        navigator.clipboard.writeText(postUrl).then(() => {
          toast.success('Link copied to clipboard!');
        }).catch((err) => {
          console.error('Failed to copy:', err);
          toast.error('Failed to copy link');
        });
        // Don't close popup after copying
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    // Don't close popup after sharing
  }, [postIdentifier, content]);

  const handleCommentPost = useCallback(async () => {
    if (!commentInput.trim()) {
      toast.error('Please enter a comment before posting.');
      return; // Don't post empty comments
    }

    const comment = commentInput.trim();
    console.log(comment);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/${postIdentifier}/comments`,
        { text: comment },
        {
          headers: buildAuthHeaders()
        }
      );
      const data = response.data;
      if (data?.ok === true) {
        setCommentInput('');
        setShowOptionsMenu(false);
        setShowEmojiPicker(false);
        toast.success(data?.message || 'Comment posted successfully');
        await fetchPostComments(false);
      } else {
        toast.error(data?.message || 'Unable to post comment. Please try again.');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong while posting your comment.');
    }
  }, [postIdentifier, commentInput, buildAuthHeaders, fetchPostComments]);

  // Handle emoji selection for main comment input
  const onEmojiClick = useCallback((emojiData) => {
    setCommentInput(prev => prev + emojiData.emoji);
  }, []);

  // Handle emoji selection for reply input
  const onReplyEmojiClick = useCallback((emojiData, commentId) => {
    setReplyInput(prev => prev + emojiData.emoji);
    setShowReplyEmojiPicker(prev => ({ ...prev, [commentId]: false }));
  }, []);

  // Handle emoji selection for edit comment input
  const onEditCommentEmojiClick = useCallback((emojiData, commentId) => {
    setEditText(prev => prev + emojiData.emoji);
    setShowEditCommentEmojiPicker(prev => ({ ...prev, [commentId]: false }));
  }, []);

  // Handle emoji selection for edit reply input
  const onEditReplyEmojiClick = useCallback((emojiData, replyId) => {
    setEditReplyText(prev => prev + emojiData.emoji);
    setShowEditReplyEmojiPicker(prev => ({ ...prev, [replyId]: false }));
  }, []);

  // Toggle emoji picker for main comment
  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev);
  }, []);

  // Toggle emoji picker for reply
  const toggleReplyEmojiPicker = useCallback((commentId) => {
    setShowReplyEmojiPicker(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  }, []);

  // Toggle emoji picker for edit comment
  const toggleEditCommentEmojiPicker = useCallback((commentId) => {
    setShowEditCommentEmojiPicker(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  }, []);

  // Toggle emoji picker for edit reply
  const toggleEditReplyEmojiPicker = useCallback((replyId) => {
    setShowEditReplyEmojiPicker(prev => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  }, []);

  // Add reply handlers
  const handleStartReply = useCallback((commentId, commenterName) => {
    setReplyingTo({ id: commentId, name: commenterName });
    setReplyInput('');
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyInput('');
  }, []);

  // Add edit handlers
  const handleStartEdit = useCallback((commentId, currentText) => {
    setEditingComment(commentId);
    setEditText(currentText);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingComment(null);
    setEditText('');
  }, []);

  // Define fetchReply function first
  const fetchReply = useCallback(async (comment_id) => {
    // If replies are already loaded, toggle them (hide)
    if (commentReplies[comment_id]) {
      setCommentReplies(prev => {
        const newReplies = { ...prev };
        delete newReplies[comment_id];
        return newReplies;
      });
      return;
    }

    // Check if the comment already has replies in localCommentsData
    const comment = localCommentsData.find(c => c.id === comment_id);
    if (comment && comment.has_replies && comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0) {
      // Use the replies that came with the comment
      setCommentReplies(prev => ({
        ...prev,
        [comment_id]: comment.replies
      }));
      return;
    }

    // Otherwise, fetch replies from API
    setLoadingReplies(prev => ({ ...prev, [comment_id]: true }));

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/comments/${comment_id}/replies`,
        {
          params: { per_page: 20 },
          headers: buildAuthHeaders()
        }
      );
      const data = response.data;
      if (data?.ok === true) {
        setCommentReplies(prev => ({
          ...prev,
          [comment_id]: data?.data?.replies || data?.data || []
        }));
      } else {
        console.log('Failed to fetch replies:', data);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [comment_id]: false }));
    }
  }, [commentReplies, buildAuthHeaders, localCommentsData]);

  const sendCommentReaction = useCallback(async ({ targetId, reactionType, loadingKey, refreshRepliesFor = null }) => {
    setCommentActionLoading(prev => ({ ...prev, [loadingKey]: true }));
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/comments/${targetId}/reactions`,
        { reaction: reactionType },
        { headers: buildAuthHeaders() }
      );
      const data = response.data;
      if (data?.ok === true) {
        toast.success(data?.message || 'Reaction added successfully');
        // Close the reaction popup for this comment
        setShowCommentReactionPopup(prev => ({ ...prev, [targetId]: false }));
        if (refreshRepliesFor) {
          fetchReply(refreshRepliesFor);
        } else if (clickedComments) {
          await fetchPostComments(false);
        }
      } else {
        toast.error(data?.message || 'Failed to add reaction');
        console.log('Failed to react on comment:', data);
      }
    } catch (error) {
      console.error('Error reacting on comment:', error);
      toast.error(error?.response?.data?.message || 'Error adding reaction');
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  }, [buildAuthHeaders, clickedComments, fetchPostComments, fetchReply]);

  const handleCommentReactionClick = useCallback((commentId, reactionType) => {
    sendCommentReaction({
      targetId: commentId,
      reactionType: reactionType,
      loadingKey: `comment_reaction_${commentId}_${reactionType}`
    });
  }, [sendCommentReaction]);

  // Define editComment function after fetchReply
  const editComment = useCallback(async (comment_id, newText) => {
    setCommentActionLoading(prev => ({ ...prev, [`edit_${comment_id}`]: true }));
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/comments/${comment_id}`,
        { text: newText },
        { headers: buildAuthHeaders() }
      );
      const data = response.data;
      if (data?.ok === true) {
        toast.success(data?.message || 'Comment updated successfully');
        if (clickedComments) {
          await fetchPostComments(false);
        }
        if (commentReplies[comment_id]) {
          fetchReply(comment_id);
        }
      } else {
        toast.error(data?.message || 'Failed to update comment. Please try again.');
        console.log('Failed to edit comment:', data);
      }
    } catch (error) {
      console.error('Error editing comment:', error);
      toast.error(error?.response?.data?.message || 'Error updating comment. Please try again.');
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`edit_${comment_id}`]: false }));
    }
  }, [buildAuthHeaders, clickedComments, commentReplies, fetchPostComments, fetchReply]);

  const handleSubmitEdit = useCallback(async (commentId) => {
    if (!editText.trim()) return;
    try {
      await editComment(commentId, editText);
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      console.error('Error submitting edit:', error);
    }
  }, [editText, editComment]);

  // Define editCommentReply function first
  const editCommentReply = useCallback(async (reply_id, newText) => {
    setCommentActionLoading(prev => ({ ...prev, [`edit_reply_${reply_id}`]: true }));
    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/comments/${reply_id}`,
        { text: newText },
        { headers: buildAuthHeaders() }
      );
      const data = response.data;
      if (data?.ok === true) {
        toast.success(data?.message || 'Reply updated successfully');
        const parentCommentId = findParentCommentId(reply_id);
        if (parentCommentId) {
          fetchReply(parentCommentId);
        }
      } else {
        toast.error(data?.message || 'Failed to update reply. Please try again.');
        console.log('Failed to edit reply:', data);
      }
    } catch (error) {
      console.error('Error editing reply:', error);
      toast.error(error?.response?.data?.message || 'Error updating reply. Please try again.');
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`edit_reply_${reply_id}`]: false }));
    }
  }, [buildAuthHeaders, findParentCommentId, fetchReply]);

  // Add reply edit handlers
  const handleStartEditReply = useCallback((replyId, currentText) => {
    setEditingReply(replyId);
    setEditReplyText(currentText);
  }, []);

  const handleCancelEditReply = useCallback(() => {
    setEditingReply(null);
    setEditReplyText('');
  }, []);

  const handleSubmitEditReply = useCallback(async (replyId) => {
    if (!editReplyText.trim()) return;
    try {
      await editCommentReply(replyId, editReplyText);
      setEditingReply(null);
      setEditReplyText('');
    } catch (error) {
      console.error('Error submitting reply edit:', error);
    }
  }, [editReplyText, editCommentReply]);

  // New function for deleting comments
  const deleteComment = useCallback(async (comment_id) => {
    // Store the current state of clickedComments before deletion
    const wasCommentsOpen = clickedComments;
    // Set ref to preserve state across re-renders
    keepCommentsOpenRef.current = wasCommentsOpen;
    
    setCommentActionLoading(prev => ({ ...prev, [`delete_${comment_id}`]: true }));
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/comments/${comment_id}`,
        { headers: buildAuthHeaders() }
      );
      const data = response.data;
      if (data?.ok === true) {
        toast.success(data?.message || 'Comment deleted successfully');
        
        // Remove replies for this comment if they exist
        if (commentReplies[comment_id]) {
          setCommentReplies(prev => {
            const newReplies = { ...prev };
            delete newReplies[comment_id];
            return newReplies;
          });
        }
        
        // Ensure comments section stays open if it was open before deletion
        if (wasCommentsOpen) {
          setClickedComments(true);
          keepCommentsOpenRef.current = true;
        }
        
        // Immediately remove the comment from local state (optimistic update)
        // This provides instant feedback like Instagram/Facebook
        setLocalCommentsData(prev => prev.filter(comment => comment.id !== comment_id));
        
        // Refetch ONLY comments in the background to sync with server (without showing loader)
        // This ensures we have the latest data from the server without refetching entire feed
        isRefetchingRef.current = true;
        fetchPostComments(false).then((fetchedComments) => {
          // After refetch, update with fresh data from server (even if empty array)
          // Only update if we got valid data (not null)
          if (fetchedComments !== null && Array.isArray(fetchedComments)) {
            console.log('Refetched comments after delete:', fetchedComments.length, 'comments');
            setLocalCommentsData(fetchedComments);
          } else {
            console.warn('Refetch returned invalid data, keeping optimistic update');
          }
          // Ensure comments section is still open if it was open
          if (keepCommentsOpenRef.current) {
            setClickedComments(true);
          }
        }).catch(err => {
          console.error('Error refetching comments after delete:', err);
          // If refetch fails, we already have the optimistic update
          // Still keep comments open even if refetch fails
          if (keepCommentsOpenRef.current) {
            setClickedComments(true);
          }
        }).finally(() => {
          // Reset refetch flag after refetch completes
          isRefetchingRef.current = false;
        });
        
        // NO LONGER REFETCHING ENTIRE FEED - just update comment count locally
        // This is much more efficient and provides better UX
      } else {
        toast.error(data?.message || 'Failed to delete comment');
        console.log('Failed to delete comment:', data);
        keepCommentsOpenRef.current = false;
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error?.response?.data?.message || 'Error deleting comment. Please try again.');
      keepCommentsOpenRef.current = false;
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`delete_${comment_id}`]: false }));
    }
  }, [buildAuthHeaders, clickedComments, commentReplies, fetchPostComments]);

  // New function for deleting comment replies
  const deleteCommentReply = useCallback(async (reply_id) => {
    setCommentActionLoading(prev => ({ ...prev, [`delete_reply_${reply_id}`]: true }));
    try {
      const response = await axios.delete(
        `${baseUrl}/api/v1/comments/replies/${reply_id}`,
        { headers: buildAuthHeaders() }
      );
      const data = response.data;
      if (data?.ok === true) {
        toast.success(data?.message || 'Reply deleted successfully');
        const parentCommentId = findParentCommentId(reply_id);
        
        // Refetch the parent comment's replies to update the UI
        if (parentCommentId) {
          await fetchReply(parentCommentId);
        }
        
        // Refetch all comments to update the comment count
        if (clickedComments) {
          await fetchPostComments(false);
        }
      } else {
        toast.error(data?.message || 'Failed to delete reply');
        console.log('Failed to delete reply:', data);
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error(error?.response?.data?.message || 'Error deleting reply. Please try again.');
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`delete_reply_${reply_id}`]: false }));
      setShowDeleteReplyModal(false);
      setReplyToDelete(null);
    }
  }, [buildAuthHeaders, findParentCommentId, fetchReply, clickedComments, fetchPostComments]);

  // Define addCommentReply function first
  const addCommentReply = useCallback(async (comment_id, reply) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/comments/${comment_id}/replies`,
        { text: reply },
        { headers: buildAuthHeaders() }
      );
      const data = response.data;
      if (data?.ok === true) {
        setReplyInput('');
        setReplyingTo(null);
        toast.success(data?.message || 'Reply posted successfully');
        await fetchPostComments(false);
        fetchReply(comment_id);
      } else {
        toast.error(data?.message || 'Failed to post reply. Please try again.');
        console.log('Failed to create reply:', data);
      }
    } catch (error) {
      console.error('Error adding comment reply:', error);
      toast.error(error?.response?.data?.message || 'Error posting reply. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [buildAuthHeaders, fetchPostComments, fetchReply]);

  const handleSubmitReply = useCallback(async (commentId) => {
    if (!replyInput.trim()) return;

    try {
      // Use the addCommentReply function for replies
      await addCommentReply(commentId, replyInput);
      // State is now cleared inside addCommentReply function
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  }, [replyInput, addCommentReply]);



  // Get comments to display (initial 5 or all)
  const displayedComments = showAllComments ? localCommentsData : localCommentsData.slice(0, 5);
  const hasMoreComments = localCommentsData.length > 5;

  // Get current comment count - use localCommentsData if we have fetched comments, otherwise use prop
  const getCurrentCommentCount = () => {
    // If we have local comments data (meaning we've fetched comments), use its length
    // Otherwise, use the comments prop from parent
    if (localCommentsData.length > 0 || clickedComments) {
      return localCommentsData.length;
    }
    return comments || 0;
  };


  const likeComment = useCallback(async (comment_id) => {
    await sendCommentReaction({
      targetId: comment_id,
      reactionType: 1,
      loadingKey: `like_${comment_id}`
    });
  }, [sendCommentReaction]);

  const likeCommentReply = useCallback(async (reply_id) => {
    const parentCommentId = findParentCommentId(reply_id);
    await sendCommentReaction({
      targetId: reply_id,
      reactionType: 1,
      loadingKey: `reply_like_${reply_id}`,
      refreshRepliesFor: parentCommentId || undefined
    });
  }, [findParentCommentId, sendCommentReaction]);

  const dislikeComment = useCallback(async (comment_id) => {
    await sendCommentReaction({
      targetId: comment_id,
      reactionType: 2,
      loadingKey: `comment_dislike_${comment_id}`
    });
  }, [sendCommentReaction]);

  const dislikeCommentReply = useCallback(async (reply_id) => {
    const parentCommentId = findParentCommentId(reply_id);
    await sendCommentReaction({
      targetId: reply_id,
      reactionType: 2,
      loadingKey: `reply_dislike_${reply_id}`,
      refreshRepliesFor: parentCommentId || undefined
    });
  }, [findParentCommentId, sendCommentReaction]);

  // Video play/pause handler
  const handleVideoClick = useCallback((e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err);
        });
      }
    }
  }, [isVideoPlaying]);

  // Mute/unmute handler
  const handleMuteToggle = useCallback((e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isVideoMuted;
      setIsVideoMuted(!isVideoMuted);
    }
  }, [isVideoMuted]);

  // Handle video play/pause events and progress
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const handlePlay = () => setIsVideoPlaying(true);
      const handlePause = () => setIsVideoPlaying(false);
      const handleEnded = () => setIsVideoPlaying(false);
      const handleTimeUpdate = () => {
        const progress = (videoElement.currentTime / videoElement.duration) * 100;
        setVideoProgress(progress);
      };
      
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [video]);

  // Auto-play video when in view (Instagram-style)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view - auto play (muted for browser policy)
            videoElement.muted = true;
            setIsVideoMuted(true);
            videoElement.play().catch(err => {
              console.log('Auto-play prevented:', err);
            });
          } else {
            // Video is out of view - pause
            videoElement.pause();
          }
        });
      },
      {
        threshold: 0.5, // Play when 50% of video is visible
      }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, [video]);

  const ownerid = localStorage.getItem('user_id');
  const currentUserId = userData?.user_id || userData?.id || userData?.userId || ownerid;

  // Helper function to check if current user is the author of a comment/reply
  const isCommentAuthor = useCallback((comment) => {
    // First check if is_owner field exists (from API)
    if (comment?.is_owner !== undefined) {
      return comment.is_owner === true;
    }
    // Fallback to checking author/publisher user_id
    const author = comment?.author || comment?.publisher;
    if (!author || !currentUserId) return false;
    const authorId = author.user_id || author.id || author.userId;
    // Compare as strings to handle both string and number IDs
    return String(authorId) === String(currentUserId);
  }, [currentUserId]);

  // Helper function to convert plain text URLs to clickable links
  const linkifyText = useCallback((text) => {
    if (!text) return '';
    
    // URL regex pattern - matches http://, https://, www., and common TLDs
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}[^\s]*)/gi;
    
    // Replace URLs with anchor tags
    let linkedText = text.replace(urlPattern, (match) => {
      let url = match;
      
      // Add protocol if missing
      if (!url.match(/^https?:\/\//i)) {
        url = 'http://' + url;
      }
      
      // If the text already contains an <a> tag with this URL, don't wrap it again
      if (text.includes(`href="${url}"`) || text.includes(`href='${url}'`)) {
        return match;
      }
      
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all" style="word-break: break-all; overflow-wrap: break-word;">${match}</a>`;
    });
    
    // Also handle existing <a> tags to ensure they open in new tab
    linkedText = linkedText.replace(
      /<a\s+href="([^"]+)"(?![^>]*target=)[^>]*>([^<]+)<\/a>/gi,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all" style="word-break: break-all; overflow-wrap: break-word;">$2</a>'
    );
    
    return linkedText;
  }, []);



  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#d3d1d1] smooth-content-transition max-w-full hover:shadow-md hover:border-blue-300 transition-all duration-200" key={postIdentifier}>
      <div className="p-4 flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            const userIdToNavigate = user?.user_id || user?.id || user?.userId;
            if (userIdToNavigate) {
              navigate(`/profile/${userIdToNavigate}`);
            }
          }}
        >
          <Avatar
            src={user?.avatar_url || user?.avatar}
            name={user?.fullName || user?.name}
            email={user?.email}
            alt={user?.name}
            size="md"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <div className="flex items-center space-x-1">
              <p className="text-sm text-gray-500">{timeAgo}</p>
              {isFeelingPost && feeling && (
                <>
                  <span className="text-sm text-gray-500">•</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-500">feeling</span>
                    <span className="text-base leading-none">{getFeelingEmoji(feeling.key)}</span>
                    <span className="text-sm font-medium text-gray-700">{feeling.label}</span>
                  </div>
                </>
              )}
              {(() => {
                const activityInfo = getActivityInfo(postType, content);
                if (activityInfo && !isFeelingPost) {
                  return (
                    <>
                      <span className="text-sm text-gray-500">•</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-base leading-none">{activityInfo.emoji}</span>
                        <span className="text-sm text-gray-500">{activityInfo.label}</span>
                        {activityInfo.target && (
                          <span className="text-sm font-medium text-gray-700">{activityInfo.target}</span>
                        )}
                      </div>
                    </>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            data-three-dots-button
            className="text-gray-400 cursor-pointer hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleOptionsMenu}
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Options Dropdown Menu - positioned relative to the button */}
          {showOptionsMenu && (
            <div
              data-options-menu
              className="absolute right-0 top-0 z-50 bg-white rounded-lg shadow-xl border border-[#d3d1d1] py-2 min-w-[160px] md:min-w-[200px] max-w-[250px] animate-in slide-in-from-top-2 duration-200"
            >
              <button
                onClick={handleSavePost}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
              >
                {isSaved ? 'Unsave Post' : 'Save Post'}
              </button>
              <button
                onClick={handleReportPost}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
              >
                Report Post
              </button>
              <button
                onClick={handleOpenInNewTab}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
              >
                Open post in new tab
              </button>
              <button
                onClick={handleHidePost}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer"
              >
                Hide post
              </button>
              {/* Delete Post - Only show for post owner */}
              {(user?.user_id === currentUserId || user?.id === currentUserId || String(user?.user_id) === String(currentUserId) || String(user?.id) === String(currentUserId)) && (
                <button
                  onClick={handleDeletePostClick}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium cursor-pointer border-t border-gray-200"
                >
                  Delete Post
                </button>
              )}
            </div>
          )}

          {/* Share Popup */}

        </div>
      </div>

      {content && (
        <div className="px-4 pb-3">
          {/* Colored Post - WhatsApp-like status */}
          {colorId && colorData && !image && !video && !audio && !multipleImages && !iframelink && !postfile ? (
            <div
              className="relative rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center p-8"
              style={{
                background: `linear-gradient(135deg, ${colorData.color_1 || '#b11b1b'} 0%, ${colorData.color_2 || '#d44616'} 100%)`,
                minHeight: '300px',
                maxHeight: '400px'
              }}
            >
              <div
                className="text-center w-full px-4"
                style={{
                  color: colorData.text_color || '#f5f5f5',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {/* Show feeling in colored post - REMOVED, only show in header */}
                {/* Show activity in colored post - REMOVED, only show in header */}
                <div
                  className="text-xl md:text-2xl font-medium leading-relaxed"
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    color: colorData.text_color || '#f5f5f5'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: linkifyText(content)
                  }}
                />
              </div>
            </div>
          ) : (
            /* Regular text post */
            <>
              {/* Show feeling in regular post - REMOVED, only show in header */}
              {/* Show activity in regular post - REMOVED, only show in header */}
              <div
                className="text-gray-800 prose prose-sm max-w-none"
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                dangerouslySetInnerHTML={{
                  __html: linkifyText(content)
                }}
              />
            </>
          )}
          {blog && <img src={blog?.thumbnail} alt="Post content" className="w-full h-auto object-cover cursor-pointer" onClick={() => navigate(`/blog/${blog?.id}`)} />}
        </div>
      )}

      {/* Handle multiple images - Slider/Carousel */}
      {multipleImages && multipleImages.length > 0 && (
        <div className="relative w-full bg-gray-50 overflow-hidden" style={{ maxHeight: '600px' }}>
          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '600px' }}>
            <img
              src={multipleImages[currentImageIndex]?.image || multipleImages[currentImageIndex]?.image_org}
              alt={`Post image ${currentImageIndex + 1}`}
              className="w-full h-full cursor-pointer transition-opacity duration-300"
              style={{ 
                objectFit: 'contain',
                maxHeight: '600px',
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
              onClick={() => {
                if (openImagePopup && multipleImages) {
                  openImagePopup(multipleImages, currentImageIndex);
                }
              }}
              onError={(e) => {
                console.error('Image failed to load:', multipleImages[currentImageIndex]?.image);
                e.target.src = '/perimg.png';
                e.target.className = 'w-full h-full object-cover opacity-50';
              }}
            />

            {/* Navigation Arrows - Only show if more than 1 image */}
            {multipleImages.length > 1 && (
              <>
                {/* Previous Button */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {multipleImages.length}
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {multipleImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleDotClick(index, e)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Handle single image */}
      {image && !multipleImages && (
        <div className="w-full bg-gray-50">
          <img
            src={image}
            alt="Post content"
            className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity duration-200"
            style={{ 
              objectFit: 'contain',
              maxHeight: '600px',
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
            onClick={() => {
              if (openImagePopup) {
                openImagePopup([{ image, image_org: image }], 0);
              }
            }}
            onLoad={() => {
              // console.log('Single image loaded successfully:', image);
            }}
            onError={(e) => {
              console.error('Single image failed to load:', image);
              // Show a placeholder instead of hiding the image
              e.target.src = '/perimg.png';
              e.target.className = 'w-full h-auto object-cover opacity-50';
            }}
          />
        </div>
      )}

      {/* Handle video */}
      {video && (
        <div className="relative w-full bg-gray-900 overflow-hidden" style={{ height: '500px', maxHeight: '500px' }}>
          <video 
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            src={video}
            onClick={handleVideoClick}
            playsInline
            loop
            preload="metadata"
            style={{ 
              maxHeight: '500px',
              backgroundColor: '#000'
            }}
          />
          
          {/* Play button overlay - only show when paused */}
          {!isVideoPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handleVideoClick}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-2xl hover:bg-opacity-100 transition-all duration-200 hover:scale-110">
                <svg 
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-800 ml-1" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Pause overlay - shows briefly when clicking to pause */}
          {isVideoPlaying && (
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={handleVideoClick}
            />
          )}

          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 bg-opacity-50">
            <div 
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${videoProgress}%` }}
            />
          </div>

          {/* Mute/Unmute button - top right corner */}
          <button
            onClick={handleMuteToggle}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black bg-opacity-60 hover:bg-opacity-80 flex items-center justify-center transition-all duration-200 z-10"
          >
            {isVideoMuted ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        </div>
      )}
      {iframelink && iframelink !== "" && <iframe src={`https://www.youtube.com/embed/${iframelink}`} className="w-full h-[300px] object-cover" controls></iframe>}

      {/* Handle audio */}
      {audio && (
        <div className="w-full bg-gray-50 rounded-lg p-4">
          <audio
            src={audio}
            controls
            className="w-full"
            onPlay={(e) => {
              // Pause all other audio elements when this one plays
              const audios = document.querySelectorAll("audio");
              audios.forEach((audioEl) => {
                if (audioEl !== e.target) {
                  audioEl.pause();
                }
              });
            }}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {postfile && postfile !== "" && (
        <>
          {/* If file is PDF */}
          {postfile.endsWith(".pdf") && (
            <div className="mx-4 mb-4">
              <a
                href={postfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border border-blue-200 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563eb] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FaFilePdf className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {postFileName || 'Document.pdf'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">PDF Document</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium group-hover:bg-[#1d4ed8] transition-colors">
                    Open
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* If file is MP3 */}
          {postfile.endsWith(".mp3") && (
            <div className="mx-4 mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563eb] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {postFileName || 'Audio.mp3'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Audio File</p>
                  </div>
                </div>
                <audio
                  controls
                  className="w-full"
                  onPlay={(e) => {
                    // Pause all other audio elements when this one plays
                    const audios = document.querySelectorAll("audio");
                    audios.forEach((audio) => {
                      if (audio !== e.target) {
                        audio.pause();
                      }
                    });
                  }}
                >
                  <source src={postfile} type="audio/mpeg" />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            </div>
          )}

          {/* If file is other type (generic file) */}
          {!postfile.endsWith(".pdf") && !postfile.endsWith(".mp3") && (
            <div className="mx-4 mb-4">
              <a
                href={postfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 border border-blue-200 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563eb] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {postFileName || 'Attachment'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">File Attachment</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium group-hover:bg-[#1d4ed8] transition-colors">
                    Download
                  </div>
                </div>
              </a>
            </div>
          )}
        </>
      )}

      {/* Handle Poll */}
      {postType === 'poll' && pollOptions && Array.isArray(pollOptions) && pollOptions.length > 0 && (
        <Poll
          pollOptions={pollOptions}
          onVote={handlePollVote}
          hasVoted={pollOptions.some(opt => opt.is_voted)}
          isLoading={isPollLoading}
        />
      )}



      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span
            className="cursor-pointer hover:text-blue-600 transition-colors font-medium flex items-center gap-1"
            onClick={fetchReactionDetails}
          >
            {getTotalReactionCount() || 0} Reactions
          </span>
          <div className="flex space-x-4">
            <span>{getCurrentCommentCount()} Comments</span>
            <span>{shares || 0} Shares</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#d3d1d1] relative">
          <button
            className={`inline-block items-center space-x-2 transition-all duration-200 hover:scale-105 cursor-pointer ${(userReaction || currentReaction || postReaction) ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
              }`}
            onClick={handleLikeClick}
            onMouseEnter={handleLikeButtonMouseEnter}
            onMouseLeave={handleLikeButtonMouseLeave}
          >
            {(userReaction || currentReaction || postReaction) ? (
              <>
                <span className="text-xl">{getReactionEmoji(userReaction || currentReaction || postReaction)}</span>
                <span className="text-sm font-medium">{getReactionLabel(userReaction || currentReaction || postReaction)}</span>

              </>
            ) : (
              <>
                <span className="text-xl">👍</span>
                <span className="text-sm font-medium">Like</span>
              </>
            )}
          </button>

          {/* Reaction Popup */}
          {showReactionPopup && (
            <div
              className="absolute bottom-full left-0 mb-2 z-20"
              data-reaction-popup
              onMouseEnter={handlePopupMouseEnter}
              onMouseLeave={handlePopupMouseLeave}
            >
              <div className="bg-white rounded-full shadow-2xl border-2 border-gray-300 p-3 flex items-center space-x-2">
                {[
                  { emoji: '👍', type: 1, label: 'Like' },
                  { emoji: '❤️', type: 2, label: 'Love' },
                  { emoji: '😂', type: 3, label: 'Haha' },
                  { emoji: '😮', type: 4, label: 'Wow' },
                  { emoji: '😢', type: 5, label: 'Sad' },
                  { emoji: '😡', type: 6, label: 'Angry' }
                ].map((reaction) => {
                  const count = postReactionCounts?.[reaction.type] || 0;
                  const isCurrentReaction = (userReaction || currentReaction || postReaction) === reaction.type;
                  return (
                    <button
                      key={reaction.type}
                      onClick={() => handleReactionClick(reaction.type)}
                      className={`w-10 h-10 flex items-center justify-center text-2xl hover:scale-125 transition-all duration-200 rounded-full relative ${isCurrentReaction
                        ? 'bg-blue-100 ring-2 ring-blue-500'
                        : 'hover:bg-gray-100'
                        }`}
                      title={`${reaction.label}${count > 0 ? ` (${count})` : ''}${isCurrentReaction ? ' - Current' : ''}`}
                    >
                      {reaction.emoji}
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="relative" data-comments-section>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer" onClick={handleClickComments}>
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isLoadingComments ? 'Loading...' : (getCurrentCommentCount() > 0 ? `Comments (${getCurrentCommentCount()})` : 'Comment')}
              </span>
            </button>

            {/* Comments Section */}

          </div>

          <button
            data-share-button
            className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors cursor-pointer"
            onClick={toggleSharePopup}
          >
            <IoMdShare className="w-6 h-6 font-light" />
            <span className="text-sm font-medium">Share</span>
          </button>

          {/* Bookmark button - changes color when saved */}
          <button 
            className="flex items-center space-x-2 transition-all duration-200 cursor-pointer" 
            onClick={() => {
              // Toggle local state immediately for instant visual feedback
              setLocalIsSaved(prev => !prev);
              savePost(postIdForPostOperations);
            }}
          >
            {localIsSaved ? (
              <IoBookmark className="w-5 h-5 text-yellow-500 hover:text-yellow-600 transition-colors animate-in zoom-in-50 duration-200" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-600 hover:text-yellow-500 transition-colors hover:scale-105" />
            )}
          </button>
        </div>
        {clickedComments && (
          <div className="relative top-full left-0 right-0 bg-white  rounded-lg z-10 mt-2 p-4 max-h-96 overflow-y-auto w-full animate-in slide-in-from-top-2 duration-200" data-comments-section>
            {isLoadingComments ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-500 text-sm">Loading comments...</p>
              </div>
            ) : localCommentsData && localCommentsData.length > 0 ? (
              <div className="space-y-3">


                {/* Display comments */}
                {displayedComments.map((comment) => (
                  <div key={comment.id} className="space-y-3">
                    {/* Main Comment */}
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          const author = comment.author || comment.publisher;
                          const userIdToNavigate = author?.user_id || author?.id || author?.userId;
                          if (userIdToNavigate) {
                            navigate(`/profile/${userIdToNavigate}`);
                          }
                        }}
                      >
                        <Avatar
                          src={(comment.author || comment.publisher)?.avatar_url || (comment.author || comment.publisher)?.avatar}
                          name={(comment.author || comment.publisher)?.name || (comment.author || comment.publisher)?.username || 'Unknown'}
                          email={(comment.author || comment.publisher)?.email}
                          alt={(comment.author || comment.publisher)?.name || 'User'}
                          size="sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <span
                              className="font-medium text-sm text-gray-900 block truncate cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => {
                                const author = comment.author || comment.publisher;
                                const userIdToNavigate = author?.user_id || author?.id || author?.userId;
                                if (userIdToNavigate) {
                                  navigate(`/profile/${userIdToNavigate}`);
                                }
                              }}
                            >
                              {(comment.author || comment.publisher)?.name || (comment.author || comment.publisher)?.username || 'Unknown'}
                            </span>
                            <span className="text-xs text-gray-500 block truncate">
                              {comment.created_at_human || (comment.time ? new Date(comment.time * 1000).toLocaleDateString() : 'Unknown time')}
                            </span>
                          </div>
                        
                        </div>

                        {/* Comment Text - Show edit input when editing */}
                        {editingComment === comment.id ? (
                          <div className="mb-3">
                            <div className="flex items-center space-x-3">
                              <Avatar
                                src={localStorage.getItem('user_avatar_url')}
                                name="Current User"
                                email="current@user.com"
                                alt="Your avatar"
                                size="sm"
                              />
                              <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 min-w-0 border border-blue-200 relative">
                                <input
                                  type="text"
                                  placeholder="Edit your comment..."
                                  className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSubmitEdit(comment.id);
                                    }
                                  }}
                                />
                                <button
                                  data-emoji-button
                                  className="text-gray-400 hover:text-gray-600 cursor-pointer mr-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleEditCommentEmojiPicker(comment.id);
                                  }}
                                >
                                  <Smile className="w-4 h-4" />
                                </button>
                                {showEditCommentEmojiPicker[comment.id] && (
                                  <div 
                                    data-emoji-picker
                                    className="absolute bottom-full right-0 mb-2 z-50"
                                  >
                                    <EmojiPicker
                                      onEmojiClick={(emojiData) => onEditCommentEmojiClick(emojiData, comment.id)}
                                      autoFocusSearch={false}
                                      theme="light"
                                      width={350}
                                      height={400}
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  className="text-green-500 hover:text-green-600 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubmitEdit(comment.id);
                                  }}
                                  disabled={commentActionLoading[`edit_${comment.id}`]}
                                >
                                  {commentActionLoading[`edit_${comment.id}`] ? (
                                    <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                                <button
                                  className="text-red-500 hover:text-red-600 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelEdit();
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 break-words leading-relaxed overflow-hidden mb-3">
                            {comment.Orginaltext || comment.text || 'No comment text'}
                          </p>
                        )}

                        {/* Comment Action Buttons - Hide when editing */}
                        {editingComment !== comment.id && (
                          <div className="flex items-center space-x-4 mb-2">
                            {/* Reaction Button - Shows popup with all reactions */}
                            <div className="relative">
                              <button
                                data-comment-reaction-button
                                className={`flex items-center space-x-1 cursor-pointer transition-colors ${comment.user_reaction || comment.is_comment_liked
                                  ? 'text-blue-600 hover:text-blue-700'
                                  : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReactionButtonClick(comment.id);
                                }}
                                onMouseEnter={() => handleCommentReactionButtonMouseEnter(comment.id)}
                                onMouseLeave={() => handleCommentReactionButtonMouseLeave(comment.id)}
                                disabled={commentActionLoading[`comment_reaction_${comment.id}_1`]}
                              >
                                {commentActionLoading[`comment_reaction_${comment.id}_1`] ? (
                                  <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <>
                                    {comment.user_reaction ? (
                                      <span className="text-lg">{getReactionEmoji(comment.user_reaction)}</span>
                                    ) : comment.is_comment_liked ? (
                                      <ThumbsUp className="w-4 h-4 fill-current" />
                                    ) : (
                                      <ThumbsUp className="w-4 h-4" />
                                    )}
                                  </>
                                )}
                                {(comment.reaction_counts && Object.values(comment.reaction_counts).reduce((sum, count) => sum + count, 0) > 0) || comment.comment_likes > 0 ? (
                                  <span className="text-xs text-gray-500">
                                    {comment.reaction_counts ? Object.values(comment.reaction_counts).reduce((sum, count) => sum + count, 0) : comment.comment_likes}
                                  </span>
                                ) : null}
                              </button>

                              {/* Comment Reaction Popup */}
                              {showCommentReactionPopup[comment.id] && (
                                <div
                                  className="absolute bottom-full left-0 mb-2 z-20"
                                  data-comment-reaction-popup
                                  onMouseEnter={() => handleCommentReactionPopupMouseEnter(comment.id)}
                                  onMouseLeave={() => handleCommentReactionPopupMouseLeave(comment.id)}
                                >
                                  <div className="bg-white rounded-full shadow-2xl border-2 border-gray-300 p-3 flex items-center space-x-2">
                                    {[
                                      { emoji: '👍', type: 1, label: 'Like' },
                                      { emoji: '❤️', type: 2, label: 'Love' },
                                      { emoji: '😂', type: 3, label: 'Haha' },
                                      { emoji: '😮', type: 4, label: 'Wow' },
                                      { emoji: '😢', type: 5, label: 'Sad' },
                                      { emoji: '😡', type: 6, label: 'Angry' }
                                    ].map((reaction) => {
                                      const count = comment.reaction_counts?.[reaction.type] || 0;
                                      const isCurrentReaction = (comment.user_reaction || (comment.is_comment_liked && reaction.type === 1)) === reaction.type;
                                      return (
                                        <button
                                          key={reaction.type}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCommentReactionClick(comment.id, reaction.type);
                                          }}
                                          className={`w-10 h-10 flex items-center justify-center text-2xl hover:scale-125 transition-all duration-200 rounded-full relative ${isCurrentReaction
                                            ? 'bg-blue-100 ring-2 ring-blue-500'
                                            : 'hover:bg-gray-100'
                                            }`}
                                          title={`${reaction.label}${count > 0 ? ` (${count})` : ''}${isCurrentReaction ? ' - Current' : ''}`}
                                        >
                                          {reaction.emoji}
                                          {count > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                              {count}
                                            </span>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>



                            {/* Reply Button */}
                            <button
                              className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                const author = comment.author || comment.publisher;
                                handleStartReply(comment.id, author?.name || author?.username || 'Unknown');
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs">Reply</span>
                            </button>

                            {/* View Replies Button - Show if comment has replies */}
                            {comment.has_replies && (comment.replies_count > 0 || (comment.replies && comment.replies.length > 0)) && (
                              <button
                                className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fetchReply(comment.id);
                                }}
                                disabled={loadingReplies[comment.id]}
                              >
                                {loadingReplies[comment.id] ? (
                                  <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <>
                                    {commentReplies[comment.id] ? (
                                      <>
                                        <ChevronUp className="w-4 h-4" />
                                        <span className="text-xs">Hide Replies</span>
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-4 h-4" />
                                        <span className="text-xs">
                                          View {comment.replies_count || comment.replies?.length || 0} {(comment.replies_count || comment.replies?.length || 0) === 1 ? 'Reply' : 'Replies'}
                                        </span>
                                      </>
                                    )}
                                  </>
                                )}
                              </button>
                            )}

                            {/* Edit Button - Only show for current user's comments */}
                            {isCommentAuthor(comment) && (
                              <button
                                className="flex items-center space-x-1 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartEdit(comment.id, comment.Orginaltext || comment.text || '');
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="text-xs">Edit</span>
                              </button>
                            )}
                            {/* Delete Button - Only show for current user's comments */}
                            {isCommentAuthor(comment) && (
                              <button
                                className="flex items-center space-x-1 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteComment(comment.id);
                                }}
                                disabled={commentActionLoading[`delete_${comment.id}`]}
                              >
                                {commentActionLoading[`delete_${comment.id}`] ? (
                                  <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                                <span className="text-xs">Delete</span>
                              </button>
                            )}
                          </div>
                        )}

                      
                       
                      </div>
                    </div>

                    {/* Reply Input Field - Positioned below the comment */}
                    {replyingTo && replyingTo.id === comment.id && (
                      <div className="ml-8 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm text-blue-600 font-medium">
                            Replying to {replyingTo.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelReply();
                            }}
                            className="text-blue-400 hover:text-blue-600 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Avatar
                            src={localStorage.getItem('user_avatar_url')}
                            name="Current User"
                            email="current@user.com"
                            alt="Your avatar"
                            size="sm"
                          />
                          <div className="flex-1 flex items-center bg-white rounded-full px-3 py-2 min-w-0 border border-blue-200 relative">
                            <input
                              type="text"
                              placeholder={`Reply to ${replyingTo.name}...`}
                              className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  addCommentReply(replyingTo.id, replyInput);
                                }
                              }}
                            />
                            <button
                              data-emoji-button
                              className="text-gray-400 hover:text-gray-600 cursor-pointer mr-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleReplyEmojiPicker(replyingTo.id);
                              }}
                            >
                              <Smile className="w-4 h-4" />
                            </button>
                            {showReplyEmojiPicker[replyingTo.id] && (
                              <div 
                                data-emoji-picker
                                className="absolute bottom-full right-0 mb-2 z-50"
                              >
                                <EmojiPicker
                                  onEmojiClick={(emojiData) => onReplyEmojiClick(emojiData, replyingTo.id)}
                                  autoFocusSearch={false}
                                  theme="light"
                                  width={350}
                                  height={400}
                                />
                              </div>
                            )}
                            <button
                              className="text-blue-500 hover:text-blue-600 cursor-pointer ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSubmitReply(replyingTo.id);
                              }}
                            >
                              <FaPaperPlane className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Display replies if they exist */}
                    {commentReplies[comment.id] && commentReplies[comment.id].length > 0 && (
                      <div className="ml-8 space-y-2">
                        {commentReplies[comment.id].map((reply) => (
                          <div key={reply.id} className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-200">
                            <div className="flex items-start space-x-2">
                              <div
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  const author = reply.author || reply.publisher;
                                  const userIdToNavigate = author?.user_id || author?.id || author?.userId;
                                  if (userIdToNavigate) {
                                    navigate(`/profile/${userIdToNavigate}`);
                                  }
                                }}
                              >
                                <Avatar
                                  src={(reply.author || reply.publisher)?.avatar_url || (reply.author || reply.publisher)?.avatar}
                                  name={(reply.author || reply.publisher)?.name || (reply.author || reply.publisher)?.username || 'Unknown'}
                                  email={(reply.author || reply.publisher)?.email}
                                  alt={(reply.author || reply.publisher)?.name || 'User'}
                                  size="sm"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className="font-medium text-xs text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                      onClick={() => {
                                        const author = reply.author || reply.publisher;
                                        const userIdToNavigate = author?.user_id || author?.id || author?.userId;
                                        if (userIdToNavigate) {
                                          navigate(`/profile/${userIdToNavigate}`);
                                        }
                                      }}
                                    >
                                      {(reply.author || reply.publisher)?.name || (reply.author || reply.publisher)?.username || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {reply.created_at_human || (reply.time ? new Date(reply.time * 1000).toLocaleDateString() : 'Unknown time')}
                                    </span>
                                  </div>
                                  {/* Reply Actions Menu */}
                                  <div className="flex items-center space-x-2">
                                    <button
                                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Implement reply options menu
                                        console.log('Reply options for:', reply.id);
                                      }}
                                    >
                                      <MoreHorizontal className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                {/* Reply Text - Show edit input when editing */}
                                {editingReply === reply.id ? (
                                  <div className="mb-2">
                                    <div className="flex items-center space-x-2">
                                      <Avatar
                                        src={localStorage.getItem('user_avatar_url')}
                                        name="Current User"
                                        email="current@user.com"
                                        alt="Your avatar"
                                        size="sm"
                                      />
                                      <div className="flex-1 flex items-center bg-white rounded-lg px-2 py-1 min-w-0 border border-blue-200 relative">
                                        <input
                                          type="text"
                                          placeholder="Edit your reply..."
                                          className="flex-1 bg-transparent text-xs focus:outline-none min-w-0"
                                          value={editReplyText}
                                          onChange={(e) => setEditReplyText(e.target.value)}
                                          onClick={(e) => e.stopPropagation()}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                              e.preventDefault();
                                              handleSubmitEditReply(reply.id);
                                            }
                                          }}
                                        />
                                        <button
                                          data-emoji-button
                                          className="text-gray-400 hover:text-gray-600 cursor-pointer mr-1"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleEditReplyEmojiPicker(reply.id);
                                          }}
                                        >
                                          <Smile className="w-3 h-3" />
                                        </button>
                                        {showEditReplyEmojiPicker[reply.id] && (
                                          <div 
                                            data-emoji-picker
                                            className="absolute bottom-full right-0 mb-2 z-50"
                                          >
                                            <EmojiPicker
                                              onEmojiClick={(emojiData) => onEditReplyEmojiClick(emojiData, reply.id)}
                                              autoFocusSearch={false}
                                              theme="light"
                                              width={350}
                                              height={400}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <button
                                          className="text-green-500 hover:text-green-600 cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSubmitEditReply(reply.id);
                                          }}
                                          disabled={commentActionLoading[`edit_reply_${reply.id}`]}
                                        >
                                          {commentActionLoading[`edit_reply_${reply.id}`] ? (
                                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                          ) : (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                          )}
                                        </button>
                                        <button
                                          className="text-red-500 hover:text-red-600 cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancelEditReply();
                                          }}
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-700 break-words leading-relaxed mb-2">
                                    {reply.Orginaltext || reply.text || 'No reply text'}
                                  </p>
                                )}

                                {/* Reply Action Buttons - Hide when editing */}
                                {editingReply !== reply.id && (
                                  <div className="flex items-center space-x-3">
                                    {/* Reaction Button for Reply - Shows popup with all reactions */}
                                    <div className="relative">
                                      <button
                                        data-comment-reaction-button
                                        className={`flex items-center space-x-1 cursor-pointer transition-colors ${reply.user_reaction || reply.is_comment_liked
                                          ? 'text-blue-600 hover:text-blue-700'
                                          : 'text-gray-400 hover:text-gray-600'
                                          }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCommentReactionButtonClick(reply.id);
                                        }}
                                        onMouseEnter={() => handleCommentReactionButtonMouseEnter(reply.id)}
                                        onMouseLeave={() => handleCommentReactionButtonMouseLeave(reply.id)}
                                        disabled={commentActionLoading[`comment_reaction_${reply.id}_1`]}
                                      >
                                        {commentActionLoading[`comment_reaction_${reply.id}_1`] ? (
                                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <>
                                            {reply.user_reaction ? (
                                              <span className="text-base">{getReactionEmoji(reply.user_reaction)}</span>
                                            ) : reply.is_comment_liked ? (
                                              <ThumbsUp className="w-3 h-3 fill-current" />
                                            ) : (
                                              <ThumbsUp className="w-3 h-3" />
                                            )}
                                          </>
                                        )}
                                        {(reply.reaction_counts && Object.values(reply.reaction_counts).reduce((sum, count) => sum + count, 0) > 0) || reply.comment_likes > 0 ? (
                                          <span className="text-xs text-gray-500">
                                            {reply.reaction_counts ? Object.values(reply.reaction_counts).reduce((sum, count) => sum + count, 0) : reply.comment_likes}
                                          </span>
                                        ) : null}
                                      </button>

                                      {/* Reply Reaction Popup */}
                                      {showCommentReactionPopup[reply.id] && (
                                        <div
                                          className="absolute bottom-full left-0 mb-2 z-20"
                                          data-comment-reaction-popup
                                          onMouseEnter={() => handleCommentReactionPopupMouseEnter(reply.id)}
                                          onMouseLeave={() => handleCommentReactionPopupMouseLeave(reply.id)}
                                        >
                                          <div className="bg-white rounded-full shadow-2xl border-2 border-gray-300 p-2 flex items-center space-x-1">
                                            {[
                                              { emoji: '👍', type: 1, label: 'Like' },
                                              { emoji: '❤️', type: 2, label: 'Love' },
                                              { emoji: '😂', type: 3, label: 'Haha' },
                                              { emoji: '😮', type: 4, label: 'Wow' },
                                              { emoji: '😢', type: 5, label: 'Sad' },
                                              { emoji: '😡', type: 6, label: 'Angry' }
                                            ].map((reaction) => {
                                              const count = reply.reaction_counts?.[reaction.type] || 0;
                                              const isCurrentReaction = (reply.user_reaction || (reply.is_comment_liked && reaction.type === 1)) === reaction.type;
                                              return (
                                                <button
                                                  key={reaction.type}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    const parentCommentId = findParentCommentId(reply.id);
                                                    sendCommentReaction({
                                                      targetId: reply.id,
                                                      reactionType: reaction.type,
                                                      loadingKey: `reply_reaction_${reply.id}_${reaction.type}`,
                                                      refreshRepliesFor: parentCommentId || undefined
                                                    });
                                                    setShowCommentReactionPopup(prev => ({ ...prev, [reply.id]: false }));
                                                  }}
                                                  className={`w-8 h-8 flex items-center justify-center text-xl hover:scale-125 transition-all duration-200 rounded-full relative ${isCurrentReaction
                                                    ? 'bg-blue-100 ring-2 ring-blue-500'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                                  title={`${reaction.label}${count > 0 ? ` (${count})` : ''}${isCurrentReaction ? ' - Current' : ''}`}
                                                >
                                                  {reaction.emoji}
                                                  {count > 0 && (
                                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-3 h-3 flex items-center justify-center">
                                                      {count}
                                                    </span>
                                                  )}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Edit Reply Button - Only show for current user's replies */}
                                    {isCommentAuthor(reply) && (
                                      <button
                                        className="flex items-center space-x-1 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStartEditReply(reply.id, reply.Orginaltext || reply.text || '');
                                        }}
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className="text-xs">Edit</span>
                                      </button>
                                    )}

                                    {/* Delete Reply Button - Only show for current user's replies */}
                                    {isCommentAuthor(reply) && (
                                      <button
                                        className="flex items-center space-x-1 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setReplyToDelete(reply.id);
                                          setShowDeleteReplyModal(true);
                                        }}
                                        disabled={commentActionLoading[`delete_reply_${reply.id}`]}
                                      >
                                        {commentActionLoading[`delete_reply_${reply.id}`] ? (
                                          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        )}
                                        <span className="text-xs">Delete</span>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Remove the old reply input field since it's now positioned below each comment */}

                {/* Show more/less button */}
                {hasMoreComments && (
                  <button
                    onClick={toggleShowAllComments}
                    className="w-full text-center py-3 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors border-t border-[#d3d1d1] mt-4 hover:bg-blue-50 rounded-lg cursor-pointer"
                  >
                    {showAllComments ? (
                      <span className="flex items-center justify-center space-x-1">
                        <ChevronUp className="w-4 h-4" />
                        Show less
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-1">
                        Show {localCommentsData.length - 5} more comments
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No comments yet</p>
                <p className="text-xs text-gray-400 mt-1">Be the first to comment!</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center space-x-3 mt-4">
          <Avatar
            src={userData?.avatar_url || localStorage.getItem('user_avatar_url')}
            name={userData?.username || "Current User"}
            email={userData?.email || "current@user.com"}
            alt="Your avatar"
            size="md"
          />
          <div className="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-2 min-w-0">
            <input
              type="text"
              placeholder="Comment bottom"
              className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
              id="comment-input"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !e.shiftKey) { // prevents shift+enter (new line)
                  e.preventDefault(); // prevents default form submit if inside form
                  await handleCommentPost();
                }
              }}
            />
            <div className="flex items-center space-x-6 ml-2 flex-shrink-0 relative">
              <button 
                data-emoji-button
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={toggleEmojiPicker}
              >
                <Smile className="w-6 h-6" />
              </button>
              {showEmojiPicker && (
                <div 
                  data-emoji-picker
                  className="absolute bottom-full right-0 mb-2 z-50"
                  ref={emojiPickerRef}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    theme="light"
                    width={350}
                    height={400}
                  />
                </div>
              )}
              <button
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                onClick={handleCommentPost}
              >
                <FaPaperPlane className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Share Popup */}
      <SharePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        postId={postIdentifier}
        content={content}
        onShareToTimeline={handleShareToTimeline}
        onShareToPage={handleShareToPage}
        onShareToGroup={handleShareToGroup}
        onSocialShare={handleSocialShare}
        setLoading={setLoading}
        loading={loading}
      />

      <ReactionDetailsModal
        isOpen={showReactionDetailsModal}
        onClose={() => setShowReactionDetailsModal(false)}
        data={reactionDetails}
        isLoading={isLoadingReactionDetails}
      />

      <ReportPostModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        isLoading={loading}
      />

      <DeletePostModal
        isOpen={showDeletePostModal}
        onClose={() => setShowDeletePostModal(false)}
        onConfirm={handleDeletePost}
        isLoading={loading}
      />

      {/* Delete Reply Modal */}
      <DeletePostModal
        isOpen={showDeleteReplyModal}
        onClose={() => {
          setShowDeleteReplyModal(false);
          setReplyToDelete(null);
        }}
        onConfirm={() => {
          if (replyToDelete) {
            deleteCommentReply(replyToDelete);
          }
        }}
        isLoading={commentActionLoading[`delete_reply_${replyToDelete}`]}
        title="Delete Reply"
        message="Are you sure you want to delete this reply?"
        description="This action cannot be undone. The reply will be permanently deleted."
      />

    </div>

  );
}

export default memo(PostCard);