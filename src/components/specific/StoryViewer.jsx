import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ThumbsUp, Eye, Play, Pause } from 'lucide-react';
import DeleteStoryModal from './DeleteStoryModal';
import { baseUrl } from '../../utils/constant';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

// Helper function to format time (seconds to MM:SS)
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const StoryViewer = ({ isOpen, onClose, stories, currentUser, onStoryDeleted, isCurrentUserStories = false }) => {
  const { notifyStoryUpdate } = useUser();
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const storiesRef = useRef(stories);
  const currentStoryIndexRef = useRef(0);
  // Reaction states
  const [showReactionPopup, setShowReactionPopup] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [storyReactions, setStoryReactions] = useState({}); // Store reactions for each story
  const [reacting, setReacting] = useState(false);
  const [viewedStories, setViewedStories] = useState(new Set()); // Track which stories have been marked as seen
  // Story views states
  const [showViewsModal, setShowViewsModal] = useState(false);
  const [storyViews, setStoryViews] = useState([]);
  const [loadingViews, setLoadingViews] = useState(false);
  const [viewsCount, setViewsCount] = useState(0);
  // Description expansion state
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  // Video ref and state
  const videoRef = useRef(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true); // Start as true to assume playing
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Keep refs in sync
  useEffect(() => {
    storiesRef.current = stories;
    currentStoryIndexRef.current = currentStoryIndex;
  }, [stories, currentStoryIndex]);

  const currentStory = stories && stories.length > 0 ? stories[currentStoryIndex] : null;

  // Define progress functions first (needed by hover handlers)
  const stopProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const nextStory = useCallback(() => {
    stopProgress();
    const currentIdx = currentStoryIndexRef.current;
    const storiesLength = storiesRef.current?.length || 0;

    if (currentIdx < storiesLength - 1) {
      setProgress(0);
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      onClose();
    }
  }, [stopProgress, onClose]);

  const prevStory = useCallback(() => {
    stopProgress();
    const currentIdx = currentStoryIndexRef.current;

    if (currentIdx > 0) {
      setProgress(0);
      setCurrentStoryIndex(prev => prev - 1);
    }
  }, [stopProgress]);

  // Handle progress bar - syncs with video playback for video stories
  const startProgress = useCallback(() => {
    stopProgress();
    if (isPaused || deleteModalOpen) return;

    // For video stories, progress is handled by video timeupdate event
    if (currentStory?.type === 'video') {
      return; // Don't use interval-based progress for videos
    }

    // For image stories, use interval-based progress
    const duration = 5000; // 5 seconds for images
    const interval = 50; // Update every 50ms for smoother animation
    const increment = (100 / duration) * interval;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          nextStory();
          return 0;
        }
        return newProgress;
      });
    }, interval);
  }, [isPaused, deleteModalOpen, stopProgress, nextStory, currentStory]);

  // Build auth headers
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

  // Mark story as seen
  const markStoryAsSeen = useCallback(async (storyId) => {
    // Don't mark current user's own stories as seen
    if (isCurrentUserStories || !storyId || viewedStories.has(storyId)) {
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/stories/mark-seen`,
        { story_id: storyId },
        {
          headers: buildAuthHeaders()
        }
      );

      const data = response.data;
      if (data?.ok === true || data?.api_status === 200) {
        // Mark this story as viewed to avoid duplicate API calls
        setViewedStories(prev => new Set([...prev, storyId]));
      }
    } catch (error) {
      // Silently handle errors - don't show toast for mark-seen failures
      console.error('Error marking story as seen:', error);
    }
  }, [isCurrentUserStories, viewedStories, buildAuthHeaders]);

  // Fetch story views
  const fetchStoryViews = useCallback(async (storyId) => {
    if (!storyId) return;

    setLoadingViews(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/stories/views`,
        {
          story_id: storyId,
          limit: 20,
          offset: 0
        },
        {
          headers: buildAuthHeaders()
        }
      );

      const data = response.data;
      if (data?.ok === true || data?.api_status === 200) {
        // Handle both response formats: data.users or data.data.views
        const views = data?.users || data?.data?.views || [];
        setStoryViews(views);
        setViewsCount(data?.total || views.length || 0);
      } else {
        toast.error(data?.message || 'Failed to fetch story views');
      }
    } catch (error) {
      console.error('Error fetching story views:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch story views');
    } finally {
      setLoadingViews(false);
    }
  }, [buildAuthHeaders]);


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

  // React to story
  const handleStoryReaction = useCallback(async (storyId, reactionType) => {
    if (!storyId || reacting) return;

    // Pause video if it's playing
    const wasVideoPlaying = isVideoPlaying;
    if (videoRef.current && currentStory?.type === 'video') {
      videoRef.current.pause();
    }

    setReacting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/stories/react`,
        {
          id: storyId,
          reaction: reactionType
        },
        {
          headers: buildAuthHeaders()
        }
      );

      const data = response.data;
      if (data?.ok === true || data?.api_status === 200) {
        // Check if reaction was removed
        if (data?.message === 'reaction removed') {
          // Remove the reaction from state
          setStoryReactions(prev => {
            const newReactions = { ...prev };
            delete newReactions[storyId];
            return newReactions;
          });
          toast.success('Reaction removed');
        } else {
          // Update the reaction for this story
          setStoryReactions(prev => ({
            ...prev,
            [storyId]: reactionType
          }));
          toast.success(`${getReactionLabel(reactionType)} story!`);
        }
        setShowReactionPopup(false);
        
        // Resume video if it was playing before
        if (videoRef.current && currentStory?.type === 'video' && wasVideoPlaying) {
          videoRef.current.play();
        }
      } else {
        toast.error(data?.message || 'Failed to react to story');
        // Resume video if it was playing before
        if (videoRef.current && currentStory?.type === 'video' && wasVideoPlaying) {
          videoRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error reacting to story:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong while reacting to the story.');
      // Resume video if it was playing before
      if (videoRef.current && currentStory?.type === 'video' && wasVideoPlaying) {
        videoRef.current.play();
      }
    } finally {
      setReacting(false);
    }
  }, [buildAuthHeaders, reacting, currentStory, isVideoPlaying]);

  // Handle popup close
  const handlePopupMouseLeave = () => {
    setShowReactionPopup(false);
  };

  const handleReactionClick = (reactionType) => {
    if (currentStory?.id) {
      handleStoryReaction(currentStory.id, reactionType);
    }
  };

  const handleClickOutside = (e) => {
    if (showReactionPopup && !e.target.closest('[data-story-reaction-popup]') && !e.target.closest('[data-story-reaction-button]')) {
      setShowReactionPopup(false);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Add click outside handler for reaction popup
  useEffect(() => {
    if (showReactionPopup) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showReactionPopup]);

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen && stories && stories.length > 0) {
      setCurrentStoryIndex(0);
      setProgress(0);
      setIsPaused(false);
      setShowReactionPopup(false);
      setIsDescriptionExpanded(false);
      setIsVideoPlaying(true); // Assume video will play
      
      // Initialize reactions from story data if available
      const initialReactions = {};
      stories.forEach(story => {
        if (story.user_reaction) {
          initialReactions[story.id] = story.user_reaction;
        }
      });
      setStoryReactions(initialReactions);
      
      // Try to play video after a short delay if it's a video story
      setTimeout(() => {
        if (videoRef.current && stories[0]?.type === 'video') {
          videoRef.current.play().catch(err => {
            console.log('Auto-play prevented, will play on user interaction:', err);
          });
        }
      }, 100);
    } else {
      stopProgress();
      setProgress(0);
      setShowReactionPopup(false);
      setIsDescriptionExpanded(false);
    }

    return () => {
      stopProgress();
    };
  }, [isOpen, stories, stopProgress]);

  // Restart progress when story index changes and mark story as seen
  useEffect(() => {

    if (isOpen && stories && stories.length > 0 && !isPaused && !deleteModalOpen) {
      setProgress(0);
      setShowReactionPopup(false); // Close reaction popup when story changes
      setIsDescriptionExpanded(false); // Reset description expansion when story changes
      setIsVideoLoaded(false); // Reset video loaded state
      setVideoDuration(null); // Reset video duration
      setVideoCurrentTime(0); // Reset video current time
      setIsVideoPlaying(true); // Reset to playing state (optimistic)

      let markSeenTimer = null;
      let progressTimer = null;

      // Mark current story as seen (only for other users' stories)
      const currentStory = stories[currentStoryIndex];
      if (currentStory?.id) {
        // Mark as seen after a short delay to ensure story is actually displayed
        markSeenTimer = setTimeout(() => {
          markStoryAsSeen(currentStory.id);
        }, 500); // 500ms delay to ensure story is displayed
      }

      // For image stories, start progress immediately
      // For video stories, progress is handled by video timeupdate event
      if (currentStory?.type !== 'video') {
        progressTimer = setTimeout(() => {
          startProgress();
        }, 50);
      }

      // Return cleanup function that clears both timers
      return () => {
        if (markSeenTimer) clearTimeout(markSeenTimer);
        if (progressTimer) clearTimeout(progressTimer);
        stopProgress();
        // Pause video if it's playing
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      };
    }

    return () => {
      stopProgress();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [currentStoryIndex, isOpen, isPaused, deleteModalOpen, startProgress, stopProgress, stories, markStoryAsSeen]);

  const handleMouseDown = () => {
    // Don't pause on mouse down for video stories - use play/pause button instead
    if (currentStory?.type === 'video') {
      return;
    }
    setIsPaused(true);
    stopProgress();
  };

  const handleMouseUp = () => {
    // Don't resume on mouse up for video stories
    if (currentStory?.type === 'video') {
      return;
    }
    setIsPaused(false);
    if (isOpen && stories && stories.length > 0) {
      startProgress();
    }
  };

  // Toggle video play/pause
  const toggleVideoPlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isVideoPlaying]);

  // Handle video loaded metadata - get duration and start playing
  const handleVideoLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      setVideoDuration(duration);
      setIsVideoLoaded(true);
      
      // Force auto-play the video
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
            console.log('Video auto-play successful');
          })
          .catch(err => {
            console.error('Error auto-playing video:', err);
            setIsVideoPlaying(false);
            // Try to play with muted if autoplay fails
            videoRef.current.muted = true;
            videoRef.current.play()
              .then(() => {
                setIsVideoPlaying(true);
                console.log('Video playing muted');
              })
              .catch(e => {
                console.error('Failed to play even muted:', e);
              });
          });
      }
    }
  }, []);

  // Handle video time update - update progress bar
  const handleVideoTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      
      setVideoCurrentTime(currentTime);
      
      // Update videoDuration if not set yet
      if (!videoDuration && duration) {
        setVideoDuration(duration);
      }
      
      // Update progress bar based on video playback
      if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        setProgress(progressPercent);
      }
    }
  }, [videoDuration]);

  // Handle video ended - move to next story
  const handleVideoEnded = useCallback(() => {
    setIsVideoPlaying(false);
    nextStory();
  }, [nextStory]);

  // Handle video play event
  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  // Handle video pause event
  const handleVideoPause = useCallback(() => {
    setIsVideoPlaying(false);
  }, []);

  // Open delete confirmation modal
  const handleDeleteClick = () => {
    if (!currentStory?.id) return;
    setIsPaused(true); // Pause the story
    stopProgress(); // Stop the progress timer
    setDeleteModalOpen(true);
  };

  // Delete story function
  const deleteStory = async () => {
    if (!currentStory?.id) return;

    setDeleteModalOpen(false);

    try {
      stopProgress();
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/stories/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          story_id: currentStory.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data?.api_status === 200) {
        toast.success('Story deleted successfully!');

        // Handle navigation before refreshing
        const currentIdx = currentStoryIndex;
        const willBeLastStory = currentIdx === stories.length - 1;

        // Check if user will have no more stories after deletion
        const willHaveNoStories = stories.length === 1;
        
        // Notify context about story deletion
        notifyStoryUpdate(!willHaveNoStories);

        // Call callback to refresh stories (this will update the stories prop)
        if (onStoryDeleted) {
          await onStoryDeleted();
        }

        // After stories refresh, handle navigation
        // If we were at the last story, move to the new last story
        // Otherwise, stay at the same index (next story will move up)
        setTimeout(() => {
          if (willBeLastStory && stories.length > 1) {
            // Was at last story, move to new last story
            setCurrentStoryIndex(Math.max(0, stories.length - 2));
          } else if (stories.length === 1) {
            // Was the only story, close viewer
            onClose();
          }
          // Otherwise, index stays the same (stories will update via prop)
        }, 100);
      } else {
        toast.error(data?.message || data?.errors?.error_text || 'Failed to delete story');
        // Resume progress if deletion failed
        if (isOpen && stories && stories.length > 0 && !isPaused) {
          startProgress();
        }
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('An error occurred while deleting the story');
      // Resume progress if deletion failed
      if (isOpen && stories && stories.length > 0 && !isPaused) {
        startProgress();
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextStory();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevStory();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStoryIndex, stories]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !stories || stories.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
      onClick={(e) => {
        // Close modal when clicking on the backdrop (not on the story content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onMouseDown={(e) => {
        // Don't pause if clicking on delete modal or backdrop
        if (!deleteModalOpen && e.target !== e.currentTarget) {
          handleMouseDown();
        }
      }}
      onMouseUp={(e) => {
        // Don't resume if delete modal is open or clicking on backdrop
        if (!deleteModalOpen && e.target !== e.currentTarget) {
          handleMouseUp();
        }
      }}
      onTouchStart={(e) => {
        if (!deleteModalOpen && e.target !== e.currentTarget) {
          handleMouseDown();
        }
      }}
      onTouchEnd={(e) => {
        if (!deleteModalOpen && e.target !== e.currentTarget) {
          handleMouseUp();
        }
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <FaTimes className="w-6 h-6" />
      </button>

      {/* Delete Button - Only shown for own stories */}
      {isCurrentUserStories && (
        <button
          onClick={handleDeleteClick}
          className="absolute top-4 right-16 z-10 text-white hover:text-red-400 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-2"
          aria-label="Delete story"
        >
          <FaTrash className="w-5 h-5" />
        </button>
      )}

      {/* Story Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Previous Button */}
        {currentStoryIndex > 0 && (
          <button
            onClick={prevStory}
            className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-2"
            aria-label="Previous story"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
        )}


        {/* Story Container */}
        <div 
          className="relative w-full max-w-md h-full flex flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Story Image Container - Centered */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Progress Bars - Instagram Style */}
            <div className="absolute top-0 left-0 right-0 z-50 p-3">
              {/* Story Progress Bars */}
              <div className="flex gap-2 mb-2">
                {stories.map((story, index) => (
                  <div
                    key={story.id}
                    className="flex-1 h-1 bg-gray-800/60 rounded-sm overflow-hidden border border-white/20"
                  >
                    <div
                      className="h-full bg-white rounded-sm"
                      style={{
                        width: index < currentStoryIndex
                          ? '100%'
                          : index === currentStoryIndex
                            ? `${progress}%`
                            : '0%',
                        transition: index === currentStoryIndex && !isPaused && !deleteModalOpen
                          ? 'width 0.05s linear'
                          : index < currentStoryIndex
                            ? 'width 0.3s ease-out'
                            : 'none',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Video Timeline - Only for video stories */}
           
            </div>

            {/* User Info - Top Left (Instagram Style) */}
            <div 
              className="absolute top-20 left-3 flex items-center gap-3 z-50 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => {
                const userId = currentUser?.user_id || currentUser?.id;
                if (userId) {
                  onClose();
                  navigate(`/profile/${userId}`);
                }
              }}
            >
              <img
                src={currentUser?.avatar_url || currentUser?.avatar || '/user.png'}
                alt={currentUser?.name || currentUser?.username || 'User'}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/user.png';
                }}
              />
              <div>
                <h3 className="text-white font-semibold drop-shadow-lg text-sm">
                  {currentUser?.name || currentUser?.username || 'Unknown User'}
                </h3>
                <p className="text-white/80 text-xs drop-shadow-md">
                  {currentStory?.time_text || 'Just now'}
                </p>
              </div>
            </div>

            {/* Views Button - Only for current user's stories */}
            {isCurrentUserStories && currentStory?.id && (
              <button
                onClick={() => {
                  setIsPaused(true);
                  stopProgress();
                  fetchStoryViews(currentStory.id);
                  setShowViewsModal(true);
                }}
                className="absolute top-20 right-3 flex items-center gap-1.5 text-white text-xs font-semibold z-50 bg-black/40 hover:bg-black/60 px-2.5 py-1.5 rounded-full transition-colors backdrop-blur-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{currentStory?.views || viewsCount || 0}</span>
              </button>
            )}

            {/* Top gradient overlay for better visibility */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-40" />

            {/* Centered Story Media - Image or Video */}
            {currentStory?.type === 'video' ? (
              <div className="relative w-full max-h-[70vh] flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={currentStory?.media_url}
                  className="w-full max-h-[70vh] object-contain cursor-pointer"
                  playsInline
                  autoPlay
                  preload="auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoPlayPause();
                  }}
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  onLoadedData={() => {
                    // Try to play when data is loaded
                    if (videoRef.current && !isVideoPlaying) {
                      videoRef.current.play().catch(err => {
                        console.log('Play on loaded data failed:', err);
                      });
                    }
                  }}
                  onCanPlay={() => {
                    // Try to play when video can play
                    if (videoRef.current && !isVideoPlaying) {
                      videoRef.current.play().catch(err => {
                        console.log('Play on can play failed:', err);
                      });
                    }
                  }}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onError={(e) => {
                    console.error('Error loading video:', e);
                    toast.error('Failed to load video');
                  }}
                />
                
                {/* Play Icon Overlay - Shows when video is paused */}
                {!isVideoPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (videoRef.current) {
                        videoRef.current.play();
                      }
                    }}
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 pointer-events-auto cursor-pointer">
                      <Play className="w-12 h-12 text-white" fill="white" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <img
                src={currentStory?.thumbnail || currentStory?.media_url}
                alt={currentStory?.title || 'Story'}
                className="w-full h-full object-contain"
              />
            )}

            {/* Bottom Info Section - Description and Reactions */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm p-6 z-50">
              {currentStory?.title && (
                <h4 className="text-white font-medium mb-2 drop-shadow-lg">{currentStory.title}</h4>
              )}
              {currentStory?.description && (
                <div className="text-white/90 text-sm drop-shadow-md mb-4">
                  {isDescriptionExpanded ? (
                    <div>
                      <p className="whitespace-pre-wrap break-words">{currentStory.description}</p>
                      {currentStory.description.length > 100 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDescriptionExpanded(false);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) => e.stopPropagation()}
                          className="text-white/70 hover:text-white font-medium mt-1 inline-block"
                        >
                          Show less
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="line-clamp-2">
                        {currentStory.description.length > 100
                          ? `${currentStory.description.substring(0, 100)}...`
                          : currentStory.description}
                      </p>
                      {currentStory.description.length > 100 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDescriptionExpanded(true);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) => e.stopPropagation()}
                          className="text-white/70 hover:text-white font-medium mt-1 inline-block"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Reaction Button */}
              <div className="relative flex items-center gap-2">
                <button
                  data-story-reaction-button
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 cursor-pointer ${storyReactions[currentStory?.id] ? 'text-blue-400' : 'text-white'
                    }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Pause video when opening reaction popup
                    if (videoRef.current && currentStory?.type === 'video') {
                      videoRef.current.pause();
                    }
                    setShowReactionPopup(!showReactionPopup);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  disabled={reacting}
                >
                  {storyReactions[currentStory?.id] ? (
                    <>
                      <span className="text-xl">{getReactionEmoji(storyReactions[currentStory?.id])}</span>
                      <span className="text-sm font-medium">{getReactionLabel(storyReactions[currentStory?.id])}</span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-sm font-medium">React</span>
                    </>
                  )}
                </button>

                {/* Reaction Popup */}
                {showReactionPopup && (
                  <div
                    className="absolute bottom-full left-0 mb-2 z-20"
                    data-story-reaction-popup
                    onMouseLeave={handlePopupMouseLeave}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
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
                        const isCurrentReaction = storyReactions[currentStory?.id] === reaction.type;
                        return (
                          <button
                            key={reaction.type}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReactionClick(reaction.type);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            className={`w-10 h-10 flex items-center justify-center text-2xl hover:scale-125 transition-all duration-200 rounded-full relative ${isCurrentReaction
                              ? 'bg-blue-100 ring-2 ring-blue-500'
                              : 'hover:bg-gray-100'
                              }`}
                            title={`${reaction.label}${isCurrentReaction ? ' - Current' : ''}`}
                            disabled={reacting}
                          >
                            {reaction.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Next Button */}
        {currentStoryIndex < stories.length - 1 && (
          <button
            onClick={nextStory}
            className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-2"
            aria-label="Next story"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>


      {/* Delete Confirmation Modal */}
      <DeleteStoryModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          // Resume progress when modal is closed without deleting
          setIsPaused(false);
          if (isOpen && stories && stories.length > 0) {
            startProgress();
          }
        }}
        onConfirm={deleteStory}
        storyTitle={currentStory?.title}
      />

      {/* Story Views Modal */}
      {showViewsModal && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
          onClick={() => {
            setShowViewsModal(false);
            setIsPaused(false);
            if (isOpen && stories && stories.length > 0) {
              startProgress();
            }
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Story Views ({viewsCount})
              </h3>
              <button
                onClick={() => {
                  setShowViewsModal(false);
                  setIsPaused(false);
                  if (isOpen && stories && stories.length > 0) {
                    startProgress();
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
              {loadingViews ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : storyViews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Eye className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">No views yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {storyViews.map((view, index) => (
                    <div 
                      key={view.user_id || view.id || index} 
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        const userId = view.user_id || view.id;
                        if (userId) {
                          setShowViewsModal(false);
                          onClose(); // Close story viewer
                          navigate(`/profile/${userId}`);
                        }
                      }}
                    >
                      <img
                        src={view.avatar_url || view.avatar || '/user.png'}
                        alt={view.name || view.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/user.png';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {view.name || view.username || 'Unknown User'}
                        </h4>
                        {view.username && view.name && (
                          <p className="text-xs text-gray-500">@{view.username}</p>
                        )}
                        {(view.time_text || view.viewed_at) && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {view.time_text || (() => {
                              try {
                                const date = new Date(view.viewed_at);
                                const now = new Date();
                                const diffMs = now - date;
                                const diffMins = Math.floor(diffMs / 60000);
                                const diffHours = Math.floor(diffMs / 3600000);
                                const diffDays = Math.floor(diffMs / 86400000);
                                
                                if (diffMins < 1) return 'Just now';
                                if (diffMins < 60) return `${diffMins}m ago`;
                                if (diffHours < 24) return `${diffHours}h ago`;
                                if (diffDays < 7) return `${diffDays}d ago`;
                                return date.toLocaleDateString();
                              } catch (e) {
                                return view.viewed_at;
                              }
                            })()}
                          </p>
                        )}
                      </div>
                      {view.verified && (
                        <img 
                          src="/icons/verified.png" 
                          alt="Verified" 
                          className="w-4 h-4"
                          title="Verified User"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;

