import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BiBarChartAlt2 } from "react-icons/bi";
import { CiCirclePlus } from "react-icons/ci";
import { Icon } from '@iconify/react';

import {
  BsImage,
  BsCameraVideo,
  BsFolder,
} from "react-icons/bs";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Play,
  Smile,
  Send,
  X,
  MapPin,
  BarChart3,
  Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FeedCard = ({ image, username, isVideo = false }) => (
  <div className="relative flex-shrink-0 w-40 h-52 rounded-xl overflow-hidden cursor-pointer group">
    <img
      src="/perimg.png"
      alt={username}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
    {isVideo && (
      <div className="absolute top-3 right-3 bg-black bg-opacity-50 rounded-full p-1.5">
        <Play className="text-white w-3 h-3" />
      </div>
    )}
    <div className="absolute bottom-3 left-3 flex items-center space-x-2">
      <img
        src="/perimg.png"
        alt={username}
        className="w-8 h-8 rounded-full border-2 border-white object-cover"
      />
      <span className="text-white text-sm font-medium">{username}</span>
    </div>
  </div>
);

const ScrollableSection = ({ children, title }) => {
  const scrollRef = useRef(null);

  return (
    <div className="relative stable-layout">
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide smooth-scroll pb-2"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {children}
      </div>
    </div>
  );
};

const PostCard = ({ user, content, image, likes, comments, shares, saves, timeAgo }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img
          src="/perimg.png"
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>

    {content && (
      <div className="px-4 pb-3">
        <p className="text-gray-800">{content}</p>
      </div>
    )}

    {image && (
      <div className="relative">
        <img
          src="/mobile.jpg"
          alt="Post content"
          className="w-full h-auto object-cover"
        />
      </div>
    )}

    <div className="p-4">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>{likes} Likes</span>
        <div className="flex space-x-4">
          <span>{comments} Comments</span>
          <span>{shares} Shares</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
          <Share className="w-5 h-5" />
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-3 mt-4">
        <img
          src="/perimg.png"
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Comment"
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <div className="flex items-center space-x-2 ml-2">
            <button className="text-gray-400 hover:text-gray-600">
              <Share className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <Smile className="w-4 h-4" />
            </button>
            <button className="text-blue-500 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FriendSuggestionCard = ({ user, onAddFriend }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-w-[150px] max-w-[150px] md:min-w-[160px] md:max-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow duration-200">
    <div className="relative">
      <img
        src="/perimg.png"
        alt={user.name}
        className="w-full h-28 md:h-32 object-cover"
      />
    </div>
    <div className="p-3 text-center">
      <h3 className="font-semibold text-gray-900 text-xs md:text-sm mb-1 truncate">{user.name}</h3>
      <p className="text-xs text-gray-500 mb-3 truncate">{user.username}</p>
      <button
        onClick={onAddFriend}
        className="bg-white border border-gray-300 text-gray-700 px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm hover:bg-gray-50 transition-colors w-full font-medium"
      >
        Add Friend
      </button>
    </div>
  </div>
);

const InfiniteFriendSuggestions = ({ friendSuggestions, onAddFriend }) => {
  const [displayedFriends, setDisplayedFriends] = useState([]);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollCheckRef = useRef(null);
  const isLoadingRef = useRef(false);

  const generateMoreFriends = useCallback(() => {
    const names = ['Alex Johnson', 'Sarah Wilson', 'Mike Chen', 'Emma Davis', 'David Kumar', 'Lisa Zhang', 'James Rodriguez', 'Anna Patel', 'Tom Brown', 'Maria Garcia', 'John Smith', 'Sophie Turner', 'Chris Lee', 'Rachel Green', 'Daniel Clark', 'Nina Sharma'];
    const usernames = ['@alex_dev', '@sarah_designer', '@mike_photo', '@emma_writer', '@david_code', '@lisa_art', '@james_music', '@anna_travel', '@tom_fitness', '@maria_chef', '@john_travel', '@sophie_reads', '@chris_tech', '@rachel_yoga', '@daniel_art', '@nina_dance'];

    const newFriends = [];
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * names.length);
      newFriends.push({
        id: Date.now() + Math.random() + i,
        name: names[randomIndex],
        username: usernames[randomIndex],
        avatar: '/api/placeholder/160/128'
      });
    }
    return newFriends;
  }, []);

  useEffect(() => {
    const initialFriends = [...friendSuggestions, ...generateMoreFriends()];
    setDisplayedFriends(initialFriends);
  }, [friendSuggestions, generateMoreFriends]);

  // Throttled scroll check function
  const checkScrollButtons = useCallback(() => {
    if (scrollCheckRef.current) {
      cancelAnimationFrame(scrollCheckRef.current);
    }
    
    scrollCheckRef.current = requestAnimationFrame(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    });
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollCheckRef.current) {
        cancelAnimationFrame(scrollCheckRef.current);
      }
    };
  }, [displayedFriends, checkScrollButtons]);

  const scrollLeft = useCallback(() => {
    if (scrollRef.current) {
      const cardWidth = 176; // 160px + 16px gap
      scrollRef.current.scrollBy({ left: -cardWidth * 3, behavior: 'smooth' });
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        setTimeout(checkScrollButtons, 300);
      });
    }
  }, [checkScrollButtons]);

  const scrollRight = useCallback(() => {
    if (scrollRef.current) {
      const cardWidth = 176; // 160px + 16px gap
      scrollRef.current.scrollBy({ left: cardWidth * 3, behavior: 'smooth' });
      
      // Load more friends when near the end (throttled)
      if (!isLoadingRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 500) {
          isLoadingRef.current = true;
          requestAnimationFrame(() => {
            setDisplayedFriends(prev => [...prev, ...generateMoreFriends()]);
            setTimeout(() => {
              isLoadingRef.current = false;
            }, 300);
          });
        }
      }
      
      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        setTimeout(checkScrollButtons, 300);
      });
    }
  }, [checkScrollButtons, generateMoreFriends]);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    checkScrollButtons();
  }, [checkScrollButtons]);

  return (
    <div className="relative group stable-layout">
      {/* Left Arrow - Desktop only */}
      <button
        onClick={scrollLeft}
        className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center transition-all duration-200 hover:shadow-xl hidden md:flex group-hover:opacity-100 will-change-transform ${canScrollLeft ? 'opacity-70 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
          }`}
        disabled={!canScrollLeft}
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow - Desktop only */}
      <button
        onClick={scrollRight}
        className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center transition-all duration-200 hover:shadow-xl hidden md:flex group-hover:opacity-100 will-change-transform ${canScrollRight ? 'opacity-70 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
          }`}
        disabled={!canScrollRight}
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide smooth-scroll pb-2 px-2 md:px-12"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch' // Better touch scrolling on mobile
        }}
        onScroll={handleScroll}
      >
        {displayedFriends.map(friend => (
          <FriendSuggestionCard
            key={friend.id}
            user={friend}
            onAddFriend={() => onAddFriend(friend.id)}
          />
        ))}
      </div>
    </div>
  );
};

const QuickActionsSection = ({ className = '' }) => {
  const actions = [
    {
      icon: () => <Icon icon="iconoir:post-solid" width="30" height="30" style={{ color: '#9748ff' }} />,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
      path: '/posts',
    },
    {
      icon: () => <Icon icon="solar:album-bold" width="30" height="30" style={{ color: '#8BC34B' }} />,
      color: 'text-green-500',
      bg: 'bg-green-50',
      path: '/albums',
    },
    {
      icon: () => <Icon icon="solar:folder-bold" width="30" height="30" style={{ color: '#F44336' }} />,
      color: 'text-red-500',
      bg: 'bg-red-50',
      path: '/folders',
    },
    {
      icon: () => <Icon icon="material-symbols:forum" width="30" height="30" style={{ color: '#8BC34B' }} />,
      color: 'text-green-600',
      bg: 'bg-green-50',
      path: '/forums',
    },
    {
      icon: () => <Icon icon="mingcute:group-3-fill" width="30" height="30" style={{ color: '#01A9F4' }} />,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      path: '/groups',
    },
    {
      icon: () => <Icon icon="fluent:document-one-page-multiple-24-filled" width="30" height="30" style={{ color: '#F69F58' }} />,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      path: '/documents',
    },
    {
      icon: () => <Icon icon="bxl:blogger" width="30" height="30" style={{ color: '#F25D4D' }} />,
      color: 'text-red-500',
      bg: 'bg-red-50',
      path: '/blogs',
    },
    {
      icon: () => <Icon icon="mingcute:news-fill" width="30" height="30" style={{ color: '#009DA0' }} />,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      path: '/news',
    },
    {
      icon: () => <Icon icon="hugeicons:new-job" width="30" height="30" style={{ color: '#4CAF50' }} />,
      color: 'text-green-500',
      bg: 'bg-green-50',
      path: '/jobs',
    },
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-[#808080] px-3 md:px-4 py-2 mb-4 md:mb-6 ${className}`}>
      <div className="flex items-center justify-between overflow-x-auto space-x-1 md:space-x-2">
        {actions.map((action, index) => (
          <Link to={action.path} key={index} className="flex-shrink-0">
            <button
              className={`flex flex-col items-center space-y-1 md:space-y-2 p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${action.bg} flex items-center justify-center cursor-pointer`}>
                <action.icon />
              </div>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CreatePostPopup = ({ isOpen, onClose }) => {
  const [postText, setPostText] = useState('');
  const [showSharing, setShowSharing] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (type) => {
    const input = document.createElement('input');
    input.type = 'file';

    if (type === 'image') {
      input.accept = 'image/*';
      input.multiple = true;
    } else if (type === 'video') {
      input.accept = 'video/*';
    } else if (type === 'audio') {
      input.accept = 'audio/*';
    } else {
      input.accept = '*';
    }

    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length) {
        if (type === 'image') {
          // Add all images
          const newFiles = files.map((file) => ({
            name: file.name,
            type,
            file,
          }));
          setSelectedFiles((prev) => [...prev, ...newFiles]);
        } else {
          // Replace existing for video/audio/file
          setSelectedFiles([{ name: files[0].name, type, file: files[0] }]);
        }
      }
    };

    input.click();
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  // Handle Escape key to close popup
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePost = () => {
    console.log('Posting:', { postText, commentsEnabled, showSharing });
    setPostText('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-2 md:px-6"
      style={{ backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border-b border-gray-200 gap-3">
          <div className="flex items-center space-x-3">
            <img
              src="/perimg.png"
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <h2 className="text-xl font-semibold text-gray-800">Create a Post</h2>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MapPin className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handlePost}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-full font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Text Input */}
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 min-h-[120px]"
            rows="5"
          />

          {/* Media Options */}
          <div className="mt-6">
            {/* Display selected files */}
            {selectedFiles.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex w-full sm:w-[48%] md:w-[32%] items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <span className="text-gray-800 text-sm truncate w-full">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-gray-600 hover:text-red-600 text-lg font-bold"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {/* Image */}
              <button
                className="flex items-center space-x-3 p-3 cursor-pointer"
                onClick={() => handleFileSelect('image')}
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <BsImage className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Image</span>
              </button>

              {/* Video */}
              <button
                className="flex items-center space-x-3 p-3 cursor-pointer"
                onClick={() => handleFileSelect('video')}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BsCameraVideo className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Video</span>
              </button>

              {/* File */}
              <button
                className="flex items-center space-x-3 p-3 cursor-pointer"
                onClick={() => handleFileSelect('file')}
              >
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BsFolder className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-gray-700 font-medium">File's</span>
              </button>

              {/* Poll */}
              <button className="flex items-center space-x-3 p-3 cursor-pointer">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BiBarChartAlt2 className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Poll</span>
              </button>

              {/* Audio */}
              <button
                className="flex items-center space-x-3 p-3 cursor-pointer"
                onClick={() => handleFileSelect('audio')}
              >
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Icon icon="mdi:music" className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-gray-700 font-medium">Audio</span>
              </button>

              {/* Feelings */}
              <button className="flex items-center space-x-3 p-3 cursor-pointer">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Smile className="w-5 h-5 text-yellow-600" />
                </div>
                <span className="text-gray-700 font-medium">Feelings</span>
              </button>

              {/* GIF */}
              <button className="flex items-center space-x-3 p-3 cursor-pointer">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Icon icon="mdi:gif" className="w-5 h-5 text-pink-600" />
                </div>
                <span className="text-gray-700 font-medium">GIF</span>
              </button>

              {/* Color */}
              <button className="flex items-center space-x-3 p-3 cursor-pointer">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-gray-700 font-medium">Color</span>
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 font-medium">Sharing</span>
                <button
                  onClick={() => setShowSharing(!showSharing)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  <Icon icon="mdi:chevron-down" className={`w-5 h-5 transition-transform ${showSharing ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="comments"
                  checked={commentsEnabled}
                  onChange={(e) => setCommentsEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="comments" className="text-gray-700">Turn Off Comments</label>
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 cursor-pointer z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>

  );
};

const CreatePostSection = () => {
  const [postText, setPostText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handlePost = () => {
    console.log('Posting:', { postText, selectedFiles });
    setPostText('');
    setSelectedFiles([]);
  };

  const handleMoreClick = () => {
    setShowPopup(true);
  };

  // 👉 File selector logic
  const handleFileSelect = (type) => {
    const input = document.createElement('input');
    input.type = 'file';

    if (type === 'image') {
      input.accept = 'image/*';
      input.multiple = true;
    } else if (type === 'video') {
      input.accept = 'video/*';
    } else if (type === 'audio') {
      input.accept = 'audio/*';
    } else {
      input.accept = '*';
    }

    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length) {
        if (type === 'image') {
          const newFiles = files.map((file) => ({
            name: file.name,
            type,
            file,
          }));
          setSelectedFiles((prev) => [...prev, ...newFiles]);
        } else {
          setSelectedFiles([{ name: files[0].name, type, file: files[0] }]);
        }
      }
    };

    input.click();
  };

  // ❌ Remove file handler
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#808080] px-6 py-8 shadow-sm">
        {/* Input Field */}
        <div className="relative mb-4">
          <img
            src="/perimg.png"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover absolute left-2 top-1/2 -translate-y-1/2"
          />

          <input
            type="text"
            placeholder="Share something"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full pl-16 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handlePost}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white"
          >
            <Icon
              icon="lets-icons:send-hor-light"
              width="35"
              height="35"
              style={{ color: '#212121' }}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-around px-2 pt-4 text-sm text-gray-600">
          <button
            onClick={() => handleFileSelect('image')}
            className="flex flex-col items-center hover:text-green-600 cursor-pointer"
          >
            <BsImage className="w-5 h-5 text-green-500" />
            <span>Image</span>
          </button>

          <button
            onClick={() => handleFileSelect('video')}
            className="flex flex-col items-center hover:text-blue-600 cursor-pointer"
          >
            <BsCameraVideo className="w-5 h-5 text-blue-500" />
            <span>Video</span>
          </button>

          <button
            onClick={() => handleFileSelect('file')}
            className="flex flex-col items-center hover:text-orange-600 cursor-pointer"
          >
            <BsFolder className="w-5 h-5 text-orange-500" />
            <span>File's</span>
          </button>

          <button
            onClick={() => console.log('Poll clicked')}
            className="flex flex-col items-center hover:text-purple-600 cursor-pointer"
          >
            <BiBarChartAlt2 className="w-5 h-5 text-purple-500" />
            <span>Poll</span>
          </button>

          <button
            onClick={handleMoreClick}
            className="flex flex-col items-center hover:text-red-600 cursor-pointer"
          >
            <CiCirclePlus className="w-5 h-5 text-red-500" />
            <span>More</span>
          </button>
        </div>

        {/* File Preview Section with ❌ Remove */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <strong>Selected Files:</strong>
            {selectedFiles.map((fileObj, index) => (
              <div
                key={index}
                className="flex items-center justify-around bg-[#EDF6F9] rounded px-2 py-1 w-[50%] "
              >
                <div className="truncate">
                  {fileObj.type.toUpperCase()}: {fileObj.name}
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 ml-4 text-lg font-bold"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Popup */}
      <CreatePostPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
};

const Home = () => {
  const [friendSuggestions, setFriendSuggestions] = useState([
    { id: 1, name: 'Siddharth Verma', username: '@muscleManSid', avatar: '/perimg.png' },
    { id: 2, name: 'Bhuvan Rana', username: '@beatsByBhuvan', avatar: '/perimg.png' },
    { id: 3, name: 'Sana Qadri', username: '@sanskariSana', avatar: '/perimg.png' },
    { id: 4, name: 'Aniket Naik', username: '@athleteAniket', avatar: '/perimg.png' },
    { id: 5, name: 'Laya Krishnan', username: '@lensByLaya', avatar: '/perimg.png' },
    { id: 6, name: 'Rajesh Kumar', username: '@rajeshkumar', avatar: '/perimg.png' },
    { id: 7, name: 'Priya Sharma', username: '@priyasharma', avatar: '/perimg.png' },
  ]);

  const feedCards = [
    {
      image: '/perimg.png',
      username: 'veer_Byte',
      isVideo: false
    },
    {
      image: '/perimg.png',
      username: 'rinkaNova',
      isVideo: false
    },
    {
      image: '/perimg.png',
      username: 'vikram_...',
      isVideo: false
    },
    {
      image: '/perimg.png',
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
  ];

  const posts = [
    {
      id: 1,
      user: {
        name: 'feeliummagic',
        avatar: '/perimg.png'
      },
      content: 'Explore new horizons... Follow us for design inspiration, Check out our latest graphic design and branding content. @feeliummagic...more',
      image: '/mobile.jpg',
      likes: '2k+',
      comments: '100+',
      shares: '250+',
      saves: '50+',
      timeAgo: '2h ago'
    },
    {
      id: 2,
      user: {
        name: '_amu_456',
        avatar: '/perimg.png'
      },
      content: 'What a thrilling clash between MI & LSG last night! LSG got the time only with Mitchell Marsh hammering 60 off just 31 balls, powering them to a massive 204/5. Mumbai fought back strongly, but Suryakumar Yadav brought them back with a classy 67 (43). Hardik Pandya shined with the ball (3/21), but LSG\'s bowlers held their nerve in the death overs, sealing a 12-run win. Momentum shift. Playoff race heating up! This IPL just keeps getting better. #MIvsLSG #IPL2025 #CricketMadness #GameDay',
      image: null,
      likes: '2k+',
      comments: '100+',
      shares: '250+',
      saves: '50+',
      timeAgo: '4h ago'
    }
  ];

  const handleAddFriend = useCallback((friendId) => {
    setFriendSuggestions(prev =>
      prev.filter(friend => friend.id !== friendId)
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 px-2 md:px-4">Feed</h2>
          <div className="px-2 md:px-4">
            <ScrollableSection>
              {feedCards.map((card, index) => (
                <FeedCard
                  key={index}
                  image={card.image}
                  username={card.username}
                  isVideo={card.isVideo}
                />
              ))}
            </ScrollableSection>
          </div>
        </div>

        <div className="px-2 md:px-4 relative">
          <CreatePostSection />

          {/* Fixed sticky positioning issue */}
          <div className="sticky-optimized top-0 z-30 bg-[#EDF6F9] pt-4 md:pt-6 pb-2">
            <div className="mx-[-0.5rem] md:mx-[-1rem] px-2 md:px-4">
              <QuickActionsSection />
            </div>
          </div>

          <div className="mb-4 md:mb-6 smooth-content-transition">
            <PostCard
              user={posts[0].user}
              content={posts[0].content}
              image={posts[0].image}
              likes={posts[0].likes}
              comments={posts[0].comments}
              shares={posts[0].shares}
              saves={posts[0].saves}
              timeAgo={posts[0].timeAgo}
            />
          </div>

          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Friend Suggestions</h2>
            <InfiniteFriendSuggestions
              friendSuggestions={friendSuggestions}
              onAddFriend={handleAddFriend}
            />
          </div>

          <div className="space-y-4 md:space-y-6 mb-4 md:mb-6">
            {posts.slice(1).map(post => (
              <PostCard
                key={post.id}
                user={post.user}
                content={post.content}
                image={post.image}
                likes={post.likes}
                comments={post.comments}
                shares={post.shares}
                saves={post.saves}
                timeAgo={post.timeAgo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;