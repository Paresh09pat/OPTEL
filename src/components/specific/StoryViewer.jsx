import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DeleteStoryModal from './DeleteStoryModal';

const StoryViewer = ({ isOpen, onClose, stories, currentUser, onStoryDeleted }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const storiesRef = useRef(stories);
  const currentStoryIndexRef = useRef(0);

  // Keep refs in sync
  useEffect(() => {
    storiesRef.current = stories;
    currentStoryIndexRef.current = currentStoryIndex;
  }, [stories, currentStoryIndex]);

  const currentStory = stories && stories.length > 0 ? stories[currentStoryIndex] : null;

  // Define functions first before useEffects
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

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen && stories && stories.length > 0) {
      setCurrentStoryIndex(0);
      setProgress(0);
      setIsPaused(false);
    } else {
      stopProgress();
      setProgress(0);
    }

    return () => {
      stopProgress();
    };
  }, [isOpen, stories, stopProgress]);

  // Restart progress when story index changes
  useEffect(() => {
    if (isOpen && stories && stories.length > 0 && !isPaused) {
      setProgress(0);
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

