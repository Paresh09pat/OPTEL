import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ThumbsUp } from 'lucide-react';
import DeleteStoryModal from './DeleteStoryModal';
import { baseUrl } from '../../utils/constant';
import axios from 'axios';

const StoryViewer = ({ isOpen, onClose, stories, currentUser, onStoryDeleted }) => {
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

  // Handle hover with delay to prevent glitch
  const handleReactionButtonMouseEnter = () => {
    // Pause story when hovering over reaction button
    setIsPaused(true);
    stopProgress();
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowReactionPopup(true);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleReactionButtonMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    // Only resume story if popup is not shown (user moved away before popup appeared)
    // If popup is shown, story stays paused until user leaves popup area
    setTimeout(() => {
      if (!showReactionPopup) {
        // Resume story when leaving reaction button and popup never appeared
        setIsPaused(false);
        if (isOpen && stories && stories.length > 0) {
          startProgress();
        }
      }
    }, 100);
  };

  const handlePopupMouseEnter = () => {
    // Keep story paused when hovering over popup
    setIsPaused(true);
    stopProgress();
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

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

  // Restart progress when story index changes
  useEffect(() => {
    if (isOpen && stories && stories.length > 0 && !isPaused) {
      setProgress(0);
      setShowReactionPopup(false); // Close reaction popup when story changes
      // Small delay to ensure state is updated
      const timer = setTimeout(() => {
        startProgress();
      }, 50);
      return () => {
        clearTimeout(timer);
        stopProgress();
      };
    }

    return () => {
      stopProgress();
    };
  }, [currentStoryIndex, isOpen, isPaused, startProgress, stopProgress]);

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

      {/* Delete Button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-4 right-16 z-10 text-white hover:text-red-400 transition-colors bg-black/30 hover:bg-black/50 rounded-full p-2"
        aria-label="Delete story"
      >
        <FaTrash className="w-5 h-5" />
      </button>

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
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 cursor-pointer ${
                  storyReactions[currentStory?.id] ? 'text-blue-400' : 'text-white'
                }`}
                 onClick={(e) => {
                   e.stopPropagation(); // Prevent triggering story pause/play
                   // Pause story when clicking reaction button
                   setIsPaused(true);
                   stopProgress();
                   if (storyReactions[currentStory?.id]) {
                     // If already reacted, show popup to change reaction
                     setShowReactionPopup(true);
                   } else {
                     // If not reacted, show popup to select reaction
                     setShowReactionPopup(true);
                   }
                 }}
                onMouseDown={(e) => e.stopPropagation()} // Prevent triggering story pause
                onMouseUp={(e) => e.stopPropagation()} // Prevent triggering story play
                onMouseEnter={handleReactionButtonMouseEnter}
                onMouseLeave={handleReactionButtonMouseLeave}
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
                  onMouseEnter={handlePopupMouseEnter}
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
                          className={`w-10 h-10 flex items-center justify-center text-2xl hover:scale-125 transition-all duration-200 rounded-full relative ${
                            isCurrentReaction 
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

      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10 px-4">
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full"
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
      <div className="absolute top-16 left-4 text-white/70 text-sm z-10">
        {currentStoryIndex + 1} / {stories.length}
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
    </div>
  );
};

export default StoryViewer;

