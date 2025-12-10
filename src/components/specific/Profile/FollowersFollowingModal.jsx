import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Avatar from '../../Avatar';

const FollowersFollowingModal = ({ isOpen, onClose, type, users, loading }) => {
  const navigate = useNavigate();

  // Prevent body scrolling when modal is open
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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUserClick = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-[#d3d1d1] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#d3d1d1]">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === 'followers' ? 'Followers' : type === 'following' ? 'Following' : 'Posts'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          ) : users && users.length > 0 ? (
            <div className="space-y-3">
              {users.map((user) => {
                // Use user_id from API response (required field)
                const userId = user.user_id;
                const firstName = user.first_name || '';
                const lastName = user.last_name || '';
                const userName = `${firstName} ${lastName}`.trim() || user.username || 'Unknown User';
                // Use avatar_url from API response (already full URL)
                const userAvatar = user.avatar_url;
                
                // Clean about text (remove HTML tags if present)
                const aboutText = user.about ? user.about.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() : '';
                
                return (
                  <div
                    key={userId || user.username || Math.random()}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    onClick={() => handleUserClick(userId)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Avatar
                        src={userAvatar}
                        name={userName}
                        email={user.email}
                        alt={userName}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {userName}
                        </h3>
                        {user.username && (
                          <p className="text-sm text-gray-500 truncate">
                            @{user.username}
                          </p>
                        )}
                        {aboutText && (
                          <p className="text-xs text-gray-400 truncate mt-1" title={aboutText}>
                            {aboutText.length > 50 ? `${aboutText.substring(0, 50)}...` : aboutText}
                          </p>
                        )}
                      </div>
                    </div>
                    {userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(userId);
                        }}
                        className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
                      >
                        View Profile
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {type === 'followers' 
                  ? 'No followers yet' 
                  : type === 'following' 
                  ? 'Not following anyone yet' 
                  : 'No posts yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingModal;

