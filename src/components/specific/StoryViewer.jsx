import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ThumbsUp, Eye } from 'lucide-react';
import DeleteStoryModal from './DeleteStoryModal';
import { baseUrl } from '../../utils/constant';
import axios from 'axios';

const StoryViewer = ({ isOpen, onClose, stories, currentUser, onStoryDeleted, isCurrentUserStories = false }) => {
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

  // Handle progress bar
  const startProgress = useCallback(() => {
    stopProgress();
    if (isPaused) return;

    const duration = 5000; // 5 seconds per story
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
  }, [isPaused, stopProgress, nextStory]);

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
        setStoryViews(data?.data?.views || []);
        setViewsCount(data?.data?.total || data?.data?.views?.length || 0);
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
        // Resume story after reaction
        setIsPaused(false);
        if (isOpen && stories && stories.length > 0) {
          startProgress();
        }
      } else {
        toast.error(data?.message || 'Failed to react to story');
        // Resume story even if reaction failed
        setIsPaused(false);
        if (isOpen && stories && stories.length > 0) {
          startProgress();
        }
      }
    } catch (error) {
      console.error('Error reacting to story:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong while reacting to the story.');
      // Resume story even if error occurred
      setIsPaused(false);
      if (isOpen && stories && stories.length > 0) {
        startProgress();
      }
    } finally {
      setReacting(false);
    }
  }, [buildAuthHeaders, reacting, isOpen, stories, startProgress]);

  // Handle popup close
  const handlePopupMouseLeave = () => {
    setShowReactionPopup(false);
    // Resume story when leaving popup
    setIsPaused(false);
    if (isOpen && stories && stories.length > 0) {
      startProgress();
    }
  };

  const handleReactionClick = (reactionType) => {
    if (currentStory?.id) {
      handleStoryReaction(currentStory.id, reactionType);
    }
  };

  const handleClickOutside = (e) => {
    if (showReactionPopup && !e.target.closest('[data-story-reaction-popup]') && !e.target.closest('[data-story-reaction-button]')) {
      setShowReactionPopup(false);
      // Resume story when clicking outside reaction area
      setIsPaused(false);
      if (isOpen && stories && stories.length > 0) {
        startProgress();
      }
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
      // Initialize reactions from story data if available
      const initialReactions = {};
      stories.forEach(story => {
        if (story.user_reaction) {
          initialReactions[story.id] = story.user_reaction;
        }
      });
      setStoryReactions(initialReactions);
    } else {
      stopProgress();
      setProgress(0);
      setShowReactionPopup(false);
    }

    return () => {
      stopProgress();
    };
  }, [isOpen, stories, stopProgress]);

  // Restart progress when story index changes and mark story as seen
  useEffect(() => {

    if (isOpen && stories && stories.length > 0 && !isPaused) {
      setProgress(0);
      setShowReactionPopup(false); // Close reaction popup when story changes

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

      // Small delay to ensure state is updated, then start progress
      progressTimer = setTimeout(() => {
        startProgress();
      }, 50);

      // Return cleanup function that clears both timers
      return () => {
        if (markSeenTimer) clearTimeout(markSeenTimer);
        if (progressTimer) clearTimeout(progressTimer);
        stopProgress();
      };
    }

    return () => {
      stopProgress();
    };
  }, [currentStoryIndex, isOpen, isPaused, startProgress, stopProgress, stories, markStoryAsSeen]);

  const handleMouseDown = () => {
    setIsPaused(true);
    stopProgress();
  };

  const handleMouseUp = () => {
    setIsPaused(false);
    if (isOpen && stories && stories.length > 0) {
      startProgress();
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = () => {
    if (!currentStory?.id) return;
    setDeleteModalOpen(true);
    stopProgress();
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
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
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


        {/* Story Image */}
        <div className="relative w-full max-w-md h-full max-h-[90vh] flex items-center justify-center">
          {/* Progress Bars - Instagram Style */}
          <div className="absolute top-0 left-0 right-0 flex gap-2 z-50 p-3">
            {stories.map((story, index) => (
              <div
                key={story.id}
                className="flex-1 h-2 bg-gray-800/60 rounded-sm overflow-hidden border border-white/20"
              >
                <div
                  className="h-full bg-white rounded-sm"
                  style={{
                    width: index < currentStoryIndex
                      ? '100%'
                      : index === currentStoryIndex
                        ? `${progress}%`
                        : '0%',
                    transition: index === currentStoryIndex && !isPaused
                      ? 'width 0.05s linear'
                      : index < currentStoryIndex
                        ? 'width 0.3s ease-out'
                        : 'none',
                  }}
                />
              </div>
            ))}
          </div>



          {/* Story Counter */}
          <div className="absolute top-14 left-3 text-white text-xs font-semibold z-50 drop-shadow-lg">
            {currentStoryIndex + 1} / {stories.length}
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
              className="absolute top-14 right-3 flex items-center gap-1.5 text-white text-xs font-semibold z-50 bg-black/40 hover:bg-black/60 px-2.5 py-1.5 rounded-full transition-colors backdrop-blur-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{currentStory?.views || viewsCount || 0}</span>
            </button>
          )}


          {/* Top gradient overlay for better progress bar visibility */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none z-40" />


          <img
            src={currentStory?.thumbnail}
            alt={currentStory?.title || 'Story'}
            className="w-full h-full object-contain"
          />


          {/* Story Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="flex items-center gap-3 mb-3">
              {currentUser?.avatar_url && (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              )}
              <div>
                <h3 className="text-white font-semibold">{currentUser?.name || currentUser?.username}</h3>
                <p className="text-white/70 text-sm">{currentStory?.time_text}</p>
              </div>
            </div>
            {currentStory?.title && (
              <h4 className="text-white font-medium mb-2">{currentStory.title}</h4>
            )}
            {currentStory?.description && (
              <p className="text-white/90 text-sm">{currentStory.description}</p>
            )}

            {/* Reaction Button */}
            <div className="relative mt-4 flex items-center gap-2">
              <button
                data-story-reaction-button
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 cursor-pointer ${storyReactions[currentStory?.id] ? 'text-blue-400' : 'text-white'
                  }`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering story pause/play
                  // Pause story when clicking reaction button
                  setIsPaused(true);
                  stopProgress();
                  // Toggle popup visibility
                  setShowReactionPopup(!showReactionPopup);
                }}
                onMouseDown={(e) => e.stopPropagation()} // Prevent triggering story pause
                onMouseUp={(e) => e.stopPropagation()} // Prevent triggering story play
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
                  onMouseDown={(e) => e.stopPropagation()} // Prevent triggering story pause
                  onMouseUp={(e) => e.stopPropagation()} // Prevent triggering story play
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
                            e.stopPropagation(); // Prevent triggering story pause/play
                            handleReactionClick(reaction.type);
                          }}
                          onMouseDown={(e) => e.stopPropagation()} // Prevent triggering story pause
                          onMouseUp={(e) => e.stopPropagation()} // Prevent triggering story play
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
          // Resume progress if modal is closed without deleting
          if (isOpen && stories && stories.length > 0 && !isPaused) {
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
                    <div key={index} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                      <img
                        src={view.avatar || view.avatar_url || '/default-avatar.png'}
                        alt={view.name || view.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {view.name || view.username || 'Unknown User'}
                        </h4>
                        {view.username && view.name && (
                          <p className="text-xs text-gray-500">@{view.username}</p>
                        )}
                        {view.time_text && (
                          <p className="text-xs text-gray-400 mt-0.5">{view.time_text}</p>
                        )}
                      </div>
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

