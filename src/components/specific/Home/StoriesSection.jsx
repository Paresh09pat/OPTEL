import React, { useState, useEffect } from 'react';
import { FaPlus, FaUser } from 'react-icons/fa';
import { useUser } from '../../../context/UserContext';
import FeedCard from './FeedCard';
import ScrollableSection from './ScrollableSection';
import StoryCreateModal from '../StoryCreateModal';
import StoryViewer from '../StoryViewer';

const StoriesSection = ({ 
  userStories = [], 
  onStoryClick, 
  onStoryCreated,
  currentUserId 
}) => {
  const { userData } = useUser();
  const [currentUserStories, setCurrentUserStories] = useState([]);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [storyBorderAnimating, setStoryBorderAnimating] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(false);

  // Fetch current user's stories
  const fetchUserStories = async () => {
    setStoriesLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/stories/user-stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          limit: 20,
          offset: 0
        }),
      });

      const data = await response.json();
      if (data?.api_status === 200 && data?.stories && data.stories.length > 0) {
        // Find current user's stories
        const userId = localStorage.getItem('user_id');
        const currentUserStoriesData = data.stories.find(
          (storyGroup) => storyGroup.user_id.toString() === userId.toString()
        );
        if (currentUserStoriesData && currentUserStoriesData.stories && currentUserStoriesData.stories.length > 0) {
          setCurrentUserStories(currentUserStoriesData.stories);
        } else {
          setCurrentUserStories([]);
        }
      } else {
        setCurrentUserStories([]);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      setCurrentUserStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStories();
  }, []);

  // Handle current user story click - show stories if exist, otherwise show create modal
  const handleCurrentUserStoryClick = () => {
    if (currentUserStories && currentUserStories.length > 0) {
      // Trigger animation on click
      setStoryBorderAnimating(true);
      setTimeout(() => {
        setStoryBorderAnimating(false);
      }, 600); // Animation duration
      setStoryViewerOpen(true);
    } else {
      setStoryModalOpen(true);
    }
  };

  // Handle story created callback
  const handleStoryCreated = () => {
    fetchUserStories();
    if (onStoryCreated) {
      onStoryCreated();
    }
  };

  // Handle story deleted callback
  const handleStoryDeleted = () => {
    fetchUserStories();
  };

  const userId = localStorage.getItem('user_id');
  const hasCurrentUserStories = currentUserStories && currentUserStories.length > 0;
  const currentUserStoryImage = hasCurrentUserStories 
    ? currentUserStories[0].thumbnail 
    : (userData?.avatar_url || userData?.avatar || '/perimg.png');

  return (
    <>
      <ScrollableSection>
        {/* Current User Story - Always show first */}
        <div className="relative flex-shrink-0">
          {/* Story indicator border - Instagram style gradient ring with click animation */}
          {hasCurrentUserStories && (
            <div 
              className="absolute inset-[-3px] rounded-xl z-[-1]"
              style={{
                background: 'conic-gradient(from 0deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%, #f09433 100%)',
                animation: storyBorderAnimating ? 'spin-gradient-once 0.6s ease-out' : 'none',
              }}
            />
          )}
          <div 
            className="relative w-[120px] h-[160px] rounded-xl overflow-hidden cursor-pointer group"
            onClick={handleCurrentUserStoryClick}
          >
            {currentUserStoryImage ? (
              <img
                src={currentUserStoryImage}
                alt={userData?.name || userData?.username || 'Your story'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/perimg.png';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <FaUser className="text-white text-4xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
            
            {/* Plus button overlay - positioned at bottom center */}
            <div 
              className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setStoryModalOpen(true);
              }}
            >
              <div className="bg-blue-600 rounded-full p-2 shadow-lg border-2 border-white hover:bg-blue-700 transition-colors">
                <FaPlus className="text-white w-4 h-4" />
              </div>
            </div>

            {/* User info at bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
              <span className="text-white text-sm font-medium drop-shadow-lg text-center">
                {hasCurrentUserStories ? 'Your story' : 'Create story'}
              </span>
            </div>
          </div>
        </div>

        {/* Other Users' Stories */}
        {Array.isArray(userStories) && userStories.length > 0 && userStories.map((user, index) => {
          // Skip current user if they appear in the list
          const userStoryUserId = user.user_id || user.id;
          if (userStoryUserId && userStoryUserId.toString() === userId?.toString()) {
            return null;
          }

          return (
            <FeedCard
              key={user.user_id || user.id || index}
              image={user.stories && user.stories.length > 0 ? user.stories[0].thumbnail : (user.avatar_url || user.avatar)}
              username={user.username || user.first_name || 'User'}
              isVideo={false}
              avatar={user.avatar_url || user.avatar}
              onClick={() => {
                if (onStoryClick) {
                  onStoryClick(user);
                }
              }}
            />
          );
        })}
      </ScrollableSection>

      {/* Story Create Modal */}
      <StoryCreateModal 
        isOpen={storyModalOpen} 
        onClose={() => setStoryModalOpen(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* Story Viewer for Current User */}
      {hasCurrentUserStories && (
        <StoryViewer
          isOpen={storyViewerOpen}
          onClose={() => setStoryViewerOpen(false)}
          stories={currentUserStories}
          currentUser={userData}
          isCurrentUserStories={true}
          onStoryDeleted={handleStoryDeleted}
        />
      )}

      {/* Add CSS animation for gradient spin */}
      <style>{`
        @keyframes spin-gradient-once {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default StoriesSection;

