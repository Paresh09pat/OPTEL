import { memo, useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Smile, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { IoBookmark } from "react-icons/io5";
import { FaFilePdf, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SharePopup from './SharePopup';
const PostCard = ({ user, content, image, video, audio, file, likes, comments, shares, saves, timeAgo, post_id, handleLike, handleDislike, isLiked, fetchComments, commentsData, savePost, isSaved, blog, multipleImages, hasMultipleImages, reportPost, hidePost, commentPost, iframelink, postfile, postFileName, getNewsFeed }) => {
  const navigate = useNavigate();
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
  // Update local comments when prop changes
  useEffect(() => {
    if (commentsData && Array.isArray(commentsData)) {
      setLocalCommentsData(commentsData);
    }
  }, [commentsData]);



  useEffect(() => {
    const handleClickOutside = (event) => {
      const commentsSection = event.target.closest('[data-comments-section]');
      if (!commentsSection) {
        setClickedComments(false);
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

  const handleClickComments = useCallback(async () => {
    try {
      if (!clickedComments) {
        setIsLoadingComments(true);
        const fetchedComments = await fetchComments(post_id);

        if (fetchedComments && Array.isArray(fetchedComments)) {
          setLocalCommentsData(fetchedComments);
        }
        setIsLoadingComments(false);
      }
      setClickedComments(!clickedComments);
    } catch (error) {
      setIsLoadingComments(false);
    }
  }, [clickedComments, fetchComments, post_id]);

  const toggleShowAllComments = useCallback(() => {
    setShowAllComments(!showAllComments);
  }, [showAllComments]);

  const handleLikeClick = useCallback(() => {
    handleLike(post_id, 1);
  }, [handleLike, post_id]);

  const handleDislikeClick = useCallback(() => {
    handleDislike(post_id);
  }, [handleDislike, post_id]);

  const toggleOptionsMenu = useCallback(() => {
    setShowOptionsMenu(!showOptionsMenu);
  }, [showOptionsMenu]);

  const toggleSharePopup = useCallback(() => {
    setShowSharePopup(!showSharePopup);
  }, [showSharePopup]);

  const handleSavePost = useCallback(() => {
    savePost(post_id);
    setShowOptionsMenu(false);
  }, [savePost, post_id]);

  const handleReportPost = useCallback(() => {
    reportPost(post_id);
    setShowOptionsMenu(false);
  }, [post_id]);

  const handleOpenInNewTab = useCallback(() => {
    window.open(`/post/${post_id}`, '_blank');
    setShowOptionsMenu(false);
  }, [post_id]);

  const handleHidePost = useCallback(() => {
    hidePost(post_id);
    setShowOptionsMenu(false);
  }, [post_id]);

  const handleShareToTimeline = useCallback(() => {
    console.log('Share to timeline:', post_id);
    setShowSharePopup(false);
  }, [post_id]);

  const handleShareToPage = useCallback(() => {
    console.log('Share to page:', post_id);
    setShowSharePopup(false);
  }, [post_id]);

  const handleShareToGroup = useCallback(() => {
    console.log('Share to group:', post_id);
    setShowSharePopup(false);
  }, [post_id]);

  const handleSocialShare = useCallback((platform) => {
    const postUrl = `${window.location.origin}/post/${post_id}`;
    const postText = content || 'Check out this post!';

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(postText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(postText + ' ' + postUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowSharePopup(false);
  }, [post_id, content]);

  const handleCommentPost = useCallback(async () => {
    if (!commentInput.trim()) return; // Don't post empty comments

    const comment = commentInput;
    console.log(comment);

    try {
      const result = await commentPost(post_id, commentInput);
      if (result.success) {
        // Clear the comment input after successful submission
        setCommentInput('');
        // Close any open menus
        setShowOptionsMenu(false);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  }, [post_id, commentInput, commentPost]);

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
    // If replies are already loaded, toggle them
    if (commentReplies[comment_id]) {
      setCommentReplies(prev => {
        const newReplies = { ...prev };
        delete newReplies[comment_id];
        return newReplies;
      });
      return;
    }

    setLoadingReplies(prev => ({ ...prev, [comment_id]: true }));

    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'fetch_comments_reply');
      formData.append('comment_id', comment_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Replies fetched:', data);
        setCommentReplies(prev => ({
          ...prev,
          [comment_id]: data.data || []
        }));
      } else {
        console.log('Failed to fetch replies:', response);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [comment_id]: false }));
    }
  }, [commentReplies]);

  // Define editComment function after fetchReply
  const editComment = useCallback(async (comment_id, newText) => {
    setCommentActionLoading(prev => ({ ...prev, [`edit_${comment_id}`]: true }));
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'edit');
      formData.append('comment_id', comment_id);
      formData.append('text', newText);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Comment edit successful:', data);
        // Refresh comments to show updated text
        if (clickedComments) {
          const fetchedComments = await fetchComments(post_id);
          if (fetchedComments && Array.isArray(fetchedComments)) {
            setLocalCommentsData(fetchedComments);
          }
        }
        // Also refresh replies if any are loaded
        if (commentReplies[comment_id]) {
          fetchReply(comment_id);
        }
      } else {
        console.log('Failed to edit comment:', response);
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`edit_${comment_id}`]: false }));
    }
  }, [fetchComments, post_id, clickedComments, commentReplies, fetchReply]);

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
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'edit_reply');
      formData.append('reply_id', reply_id);
      formData.append('text', newText);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Reply edit successful:', data);
        // Refresh replies to show updated text
        // Find which comment this reply belongs to and refresh it
        for (const commentId of Object.keys(commentReplies)) {
          if (commentReplies[commentId].some(reply => reply.id === reply_id)) {
            fetchReply(commentId);
            break;
          }
        }
      } else {
        console.log('Failed to edit reply:', response);
      }
    } catch (error) {
      console.error('Error editing reply:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`edit_reply_${reply_id}`]: false }));
    }
  }, [commentReplies, fetchReply]);

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
    setCommentActionLoading(prev => ({ ...prev, [`delete_${comment_id}`]: true }));
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'delete');
      formData.append('comment_id', comment_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Comment delete successful:', data);

        // Call getNewsFeed to refresh the entire feed
        if (getNewsFeed && typeof getNewsFeed === 'function') {
          getNewsFeed();
        }

        // Refresh comments to show updated list
        if (clickedComments) {
          const fetchedComments = await fetchComments(post_id);
          if (fetchedComments && Array.isArray(fetchedComments)) {
            setLocalCommentsData(fetchedComments);
          }
        }
        // Also remove any loaded replies for this comment
        if (commentReplies[comment_id]) {
          setCommentReplies(prev => {
            const newReplies = { ...prev };
            delete newReplies[comment_id];
            return newReplies;
          });
        }
      } else {
        console.log('Failed to delete comment:', response);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`delete_${comment_id}`]: false }));
    }
  }, [fetchComments, post_id, clickedComments, commentReplies, getNewsFeed]);

  // New function for deleting comment replies
  const deleteCommentReply = useCallback(async (reply_id) => {
    setCommentActionLoading(prev => ({ ...prev, [`delete_reply_${reply_id}`]: true }));
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'delete_reply');
      formData.append('reply_id', reply_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Reply delete successful:', data);
        // Refresh replies to show updated list
        // Find which comment this reply belongs to and refresh it
        for (const commentId of Object.keys(commentReplies)) {
          if (commentReplies[commentId].some(reply => reply.id === reply_id)) {
            fetchReply(commentId);
            break;
          }
        }
      } else {
        console.log('Failed to delete reply:', response);
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`delete_reply_${reply_id}`]: false }));
    }
  }, [commentReplies, fetchReply]);

  // Define addCommentReply function first
  const addCommentReply = useCallback(async (comment_id, reply) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'create_reply');
      formData.append('comment_id', comment_id);
      formData.append('text', reply);
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
        console.log(data);
        // Clear the reply input and close reply mode after successful submission
        setReplyInput('');
        setReplyingTo(null);
        // Refresh comments and also refresh replies for the specific comment
        fetchComments(post_id);
        // Refresh replies for this comment to show the new reply
        if (replyingTo) {
          fetchReply(replyingTo.id);
        }
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error('Error adding comment reply:', error);
      // Remove setError since it's not defined
      console.error('Error message:', error.message);
    } finally {
      setLoading(false);
    }
  }, []);

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


  const likeComment = useCallback(async (comment_id) => {
    setCommentActionLoading(prev => ({ ...prev, [`like_${comment_id}`]: true }));
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'comment_like');
      formData.append('comment_id', comment_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Comment/Reply like/unlike successful:', data);
        // Refresh comments to show updated like status
        if (clickedComments) {
          const fetchedComments = await fetchComments(post_id);
          if (fetchedComments && Array.isArray(fetchedComments)) {
            setLocalCommentsData(fetchedComments);
          }
        }
        // Also refresh replies if any are loaded
        if (commentReplies[comment_id]) {
          fetchReply(comment_id);
        }
      } else {
        console.log('Failed to like/unlike comment/reply:', response);
      }
    } catch (error) {
      console.error('Error liking/unliking comment/reply:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`like_${comment_id}`]: false }));
    }
  }, [fetchComments, post_id, clickedComments, commentReplies, fetchReply]);

  // New function for liking comment replies
  const likeCommentReply = useCallback(async (reply_id) => {
    setCommentActionLoading(prev => ({ ...prev, [`reply_like_${reply_id}`]: true }));
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'reply_like');
      formData.append('reply_id', reply_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Reply like/unlike successful:', data);
        // Refresh replies to show updated like status
        // Find which comment this reply belongs to and refresh it
        for (const commentId of Object.keys(commentReplies)) {
          if (commentReplies[commentId].some(reply => reply.id === reply_id)) {
            fetchReply(commentId);
            break;
          }
        }
      } else {
        console.log('Failed to like/unlike reply:', response);
      }
    } catch (error) {
      console.error('Error liking/unliking reply:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`reply_like_${reply_id}`]: false }));
    }
  }, [commentReplies, fetchReply]);

  // New function for disliking comments
  const dislikeComment = useCallback(async (comment_id) => {
    setCommentActionLoading(prev => ({ ...prev, [`comment_dislike_${comment_id}`]: true }));
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'comment_dislike');
      formData.append('comment_id', comment_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Comment dislike successful:', data);
        // Refresh comments to show updated dislike status
        if (clickedComments) {
          const fetchedComments = await fetchComments(post_id);
          if (fetchedComments && Array.isArray(fetchedComments)) {
            setLocalCommentsData(fetchedComments);
          }
        }
      } else {
        console.log('Failed to dislike comment:', response);
      }
    } catch (error) {
      console.error('Error disliking comment:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`comment_dislike_${comment_id}`]: false }));
    }
  }, [fetchComments, post_id, clickedComments]);

  // New function for disliking comment replies
  const dislikeCommentReply = useCallback(async (reply_id) => {
    setCommentActionLoading(prev => ({ ...prev, [`reply_dislike_${reply_id}`]: true }));
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('type', 'reply_dislike');
      formData.append('reply_id', reply_id);
      const response = await fetch(`https://ouptel.com/api/comments?access_token=${accessToken}`, {
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
        console.log('Reply dislike successful:', data);
        // Refresh replies to show updated dislike status
        // Find which comment this reply belongs to and refresh it
        for (const commentId of Object.keys(commentReplies)) {
          if (commentReplies[commentId].some(reply => reply.id === reply_id)) {
            fetchReply(commentId);
            break;
          }
        }
      } else {
        console.log('Failed to dislike reply:', response);
      }
    } catch (error) {
      console.error('Error disliking reply:', error);
    } finally {
      setCommentActionLoading(prev => ({ ...prev, [`reply_dislike_${reply_id}`]: false }));
    }
  }, [commentReplies, fetchReply]);

  const ownerid = localStorage.getItem('user_id');



  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#808080] smooth-content-transition max-w-full" key={post_id}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-sm text-gray-500">{timeAgo}</p>
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
              className="absolute right-0 top-0 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[160px] md:min-w-[200px] max-w-[250px] animate-in slide-in-from-top-2 duration-200"
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
            </div>
          )}

          {/* Share Popup */}

        </div>
      </div>

      {content && (
        <div className="px-4 pb-3">
          <div
            className="text-gray-800 prose prose-sm max-w-none"
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
            dangerouslySetInnerHTML={{
              __html: content.replace(
                /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
                '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all" style="word-break: break-all; overflow-wrap: break-word;">$2</a>'
              )
            }}
          />
          {blog && <img src={blog?.thumbnail} alt="Post content" className="w-full h-auto object-cover cursor-pointer" onClick={() => navigate(`/blog/${blog?.id}`)} />}
        </div>
      )}

      {/* Handle multiple images */}
      {multipleImages && multipleImages.length > 0 && (
        <div className="px-4 pb-3">
          <div className={`grid gap-1 ${multipleImages.length === 1 ? 'grid-cols-1' : multipleImages.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`} style={{ gridTemplateRows: 'repeat(auto-fit, minmax(150px, 1fr))', maxHeight: '400px', width: '100%', height: 'auto', display: 'grid' }}>
            {multipleImages.map((img, index) => (
              <div key={img.id || index} className={`relative overflow-hidden ${multipleImages.length === 1 ? 'col-span-1' : multipleImages.length === 2 ? 'col-span-1' : index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}`}>
                <img
                  src={img.image || img.image_org}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                  style={{ objectFit: 'cover', minHeight: '150px', maxHeight: '300px', width: '100%', height: '100%', display: 'block', maxWidth: '100%' }}
                  onClick={() => {
                    // TODO: Add image modal/lightbox functionality
                    console.log('Open image modal for:', img.image || img.image_org);
                  }}
                  onLoad={() => {
                    // console.log('Image loaded successfully:', img.image || img.image_org);
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', img.image || img.image_org);
                    // Show a placeholder instead of hiding the image
                    e.target.src = '/perimg.png';
                    e.target.className = 'w-full h-full object-cover opacity-50';
                  }}
                />
                {/* Show overlay with count for images beyond the first few */}
                {index === 2 && multipleImages.length > 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">+{multipleImages.length - 3}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Handle single image */}
      {image && !multipleImages && <img
        src={image}
        alt="Post content"
        className="w-full h-auto object-cover"
        style={{ objectFit: 'cover', minHeight: '200px', maxHeight: '400px', width: '100%', height: 'auto', display: 'block' }}
        onLoad={() => {
          // console.log('Single image loaded successfully:', image);
        }}
        onError={(e) => {
          console.error('Single image failed to load:', image);
          // Show a placeholder instead of hiding the image
          e.target.src = '/perimg.png';
          e.target.className = 'w-full h-auto object-cover opacity-50';
        }}
      />}

      {/* Handle video */}
      {video && <video className="w-full h-auto object-cover" controls src={video}></video>}
      {iframelink !== "" && <iframe src={`https://www.youtube.com/embed/${iframelink}`} className="w-full h-[300px] object-cover" controls></iframe>}

      {/* Handle audio */}
      {audio && <audio src={audio} controls className="w-full h-auto object-cover" />}

      {postfile !== "" && (
        <>
          {/* If file is PDF */}
          {postfile.endsWith(".pdf") && (
            <a
              href={postfile}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col py-2 items-center justify-center space-x-2 w-full"
            >
              <div className="flex items-center justify-center space-x-2 w-[90%] h-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-center p-4">
                {postFileName !== "" && (
                  <span className="text-gray-700 font-medium text-sm">
                    {postFileName?.slice(0, 40) + "..."}
                  </span>
                )}
                <FaFilePdf className="w-6 h-6 text-gray-600" />
                <span className="text-gray-700 font-medium text-sm">Open PDF</span>
              </div>
            </a>
          )}

          {/* If file is MP3 */}
          {postfile.endsWith(".mp3") && (
            <div className="flex flex-col py-2 items-center justify-center w-full">
              <audio
                controls
                className="w-[90%]"
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

              {postFileName !== "" && (
                <span className="text-gray-700 font-medium text-sm mt-2">
                  {postFileName?.slice(0, 40) + "..."}
                </span>
              )}
            </div>
          )}

        </>
      )}



      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{likes} Likes</span>
          <div className="flex space-x-4">
            <span>{comments} Comments</span>
            <span>{shares} Shares</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 relative">
          <button
            className={`inline-block items-center space-x-2 transition-all duration-200 hover:scale-105 cursor-pointer ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            onClick={isLiked ? handleDislikeClick : handleLikeClick}
          >
            {isLiked ? (
              <>
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                <span className="text-sm font-medium">Liked</span>
              </>
            ) : (
              <Heart className="w-5 h-5" />
            )}
          </button>

          <div className="relative" data-comments-section>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors cursor-pointer" onClick={handleClickComments}>
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isLoadingComments ? 'Loading...' : (comments > 0 ? `Comments (${comments})` : 'Comment')}
              </span>
            </button>

            {/* Comments Section */}

          </div>

          <button
            data-share-button
            className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors cursor-pointer"
            onClick={toggleSharePopup}
          >
            <Share className="w-5 h-5" />
          </button>

          {/* change the color of bookmark button when saved like we see like button */}

          <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors cursor-pointer" onClick={() => savePost(post_id)} >
            {isSaved ? <IoBookmark className="w-5 h-5 text-blue-900" /> : <Bookmark className="w-5 h-5 text-blue-900 hover:text-blue-500 transition-colors hover:scale-105  " />}
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
                      <img
                        src={comment.publisher?.avatar || '/perimg.png'}
                        alt={comment.publisher?.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <span className="font-medium text-sm text-gray-900 block truncate">
                              {comment.publisher?.first_name || 'Unknown'} {comment.publisher?.last_name || ''}
                            </span>
                            <span className="text-xs text-gray-500 block truncate">
                              {comment.time ? new Date(comment.time * 1000).toLocaleDateString() : 'Unknown time'}
                            </span>
                          </div>
                          {/* Comment Actions Menu */}
                          <div className="relative ml-2">
                            <button
                              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implement comment options menu
                                console.log('Comment options for:', comment.id);
                              }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Comment Text - Show edit input when editing */}
                        {editingComment === comment.id ? (
                          <div className="mb-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src="/perimg.png"
                                alt="Your avatar"
                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 min-w-0 border border-blue-200">
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
                            {/* Like Button - Toggles between liked/disliked */}
                            <button
                              className={`flex items-center space-x-1 cursor-pointer transition-colors ${comment.is_comment_liked
                                  ? 'text-blue-600 hover:text-blue-700'
                                  : 'text-gray-400 hover:text-gray-600'
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Like button now toggles between liked/disliked states
                                // When clicked, it will like if not liked, or unlike if already liked
                                likeComment(comment.id);
                              }}
                              disabled={commentActionLoading[`like_${comment.id}`]}
                            >
                              {commentActionLoading[`like_${comment.id}`] ? (
                                <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <ThumbsUp className={`w-4 h-4 ${comment.is_comment_liked ? 'fill-current' : ''
                                  }`} />
                              )}
                              {comment.comment_likes > 0 && (
                                <span className="text-xs text-gray-500">
                                  {comment.comment_likes}
                                </span>
                              )}
                            </button>



                            {/* Reply Button */}
                            <button
                              className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartReply(comment.id, `${comment.publisher?.first_name || 'Unknown'} ${comment.publisher?.last_name || ''}`);
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-xs">Reply</span>
                            </button>

                            {/* Edit Button - Only show for current user's comments */}
                            {comment.publisher?.user_id == ownerid && (
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
                            {comment.publisher?.user_id == ownerid && (
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

                        {/* Show replies count if comment has replies */}
                        {comment.replies_count && comment.replies_count > 0 && (
                          <div className="mt-2">
                            <span
                              className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-800 flex items-center space-x-1"
                              onClick={() => fetchReply(comment.id)}
                            >
                              {loadingReplies[comment.id] ? (
                                <>
                                  <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                  <span>Loading...</span>
                                </>
                              ) : (
                                <>
                                  <span>{comment.replies_count} {comment.replies_count === 1 ? 'reply' : 'replies'}</span>
                                  {commentReplies[comment.id] ? (
                                    <span className="text-blue-400">(hide)</span>
                                  ) : (
                                    <span className="text-blue-400">(show)</span>
                                  )}
                                </>
                              )}
                            </span>
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
                          <img
                            src="/perimg.png"
                            alt="Your avatar"
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 flex items-center bg-white rounded-full px-3 py-2 min-w-0 border border-blue-200">
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
                              <img
                                src={reply.publisher?.avatar || '/perimg.png'}
                                alt={reply.publisher?.name || 'User'}
                                className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-xs text-gray-900">
                                      {reply.publisher?.first_name || 'Unknown'} {reply.publisher?.last_name || ''}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {reply.time ? new Date(reply.time * 1000).toLocaleDateString() : 'Unknown time'}
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
                                      <img
                                        src="/perimg.png"
                                        alt="Your avatar"
                                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                      />
                                      <div className="flex-1 flex items-center bg-white rounded-lg px-2 py-1 min-w-0 border border-blue-200">
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
                                    {/* Like Button for Reply - Uses new reply_like API */}
                                    <button
                                      className={`flex items-center space-x-1 cursor-pointer transition-colors ${reply.is_comment_liked
                                          ? 'text-blue-600 hover:text-blue-700'
                                          : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Use the new likeCommentReply function for replies
                                        likeCommentReply(reply.id);
                                      }}
                                      disabled={commentActionLoading[`reply_like_${reply.id}`]}
                                    >
                                      {commentActionLoading[`reply_like_${reply.id}`] ? (
                                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <ThumbsUp className={`w-3 h-3 ${reply.is_comment_liked ? 'fill-current' : ''
                                          }`} />
                                      )}
                                      {reply.comment_likes > 0 && (
                                        <span className="text-xs text-gray-500">
                                          {reply.comment_likes}
                                        </span>
                                      )}
                                    </button>



                                    {/* Reply to Reply Button */}
                                    <button
                                      className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // TODO: Implement reply to reply functionality
                                        console.log('Reply to reply:', reply.id);
                                      }}
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      <span className="text-xs">Reply</span>
                                    </button>

                                                                         {/* Edit Reply Button - Only show for current user's replies */}
                                     {reply.publisher?.user_id == ownerid && (
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
                                    {reply.publisher?.user_id == ownerid && (
                                      <button 
                                        className="flex items-center space-x-1 text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteCommentReply(reply.id);
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
                    className="w-full text-center py-3 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors border-t border-gray-200 mt-4 hover:bg-blue-50 rounded-lg cursor-pointer"
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
          <img
            src="/perimg.png"
            alt="Your avatar"
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
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
            <div className="flex items-center space-x-6 ml-2 flex-shrink-0">
              <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <Share className="w-6 h-6" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <Smile className="w-6 h-6" />
              </button>
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
        postId={post_id}
        content={content}
        onShareToTimeline={handleShareToTimeline}
        onShareToPage={handleShareToPage}
        onShareToGroup={handleShareToGroup}
        onSocialShare={handleSocialShare}
        setLoading={setLoading}
        loading={loading}
      />

    </div>

  );
}

export default memo(PostCard);