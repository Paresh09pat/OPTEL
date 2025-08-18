import { memo, useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Smile, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { IoBookmark } from "react-icons/io5";

const PostCard = ({ user, content, image, likes, comments, shares, saves, timeAgo, post_id, handleLike, isLiked, fetchComments, commentsData }) => {

  const [clickedComments, setClickedComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [localCommentsData, setLocalCommentsData] = useState(commentsData || []);
  const [showAllComments, setShowAllComments] = useState(false);

  // Update local comments when prop changes
  useEffect(() => {
    if (commentsData && Array.isArray(commentsData)) {
      setLocalCommentsData(commentsData);
    }
  }, [commentsData]);

  // Close comments when clicking outside
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

  // Get comments to display (initial 5 or all)
  const displayedComments = showAllComments ? localCommentsData : localCommentsData.slice(0, 5);
  const hasMoreComments = localCommentsData.length > 5;

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
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-5 h-5" />
        </button>
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
        </div>
      )}

      {image && (
        <div className="relative">
          <img
            src={image}
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

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 relative">
          <button
            className={`inline-block items-center space-x-2 transition-all duration-200 hover:scale-105 cursor-pointer ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            onClick={handleLikeClick}
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
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors" onClick={handleClickComments}>
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isLoadingComments ? 'Loading...' : (comments > 0 ? `Comments (${comments})` : 'Comment')}
              </span>
            </button>

            {/* Comments Section */}
          
          </div>

          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
            <Share className="w-5 h-5" />
          </button>

          <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors">
            {saves ? <IoBookmark className="w-5 h-5 text-blue-900" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
        {clickedComments && (
              <div className="relative top-full left-0 right-0 bg-white  rounded-lg z-10 mt-2 p-4 max-h-96 overflow-y-auto w-full animate-in slide-in-from-top-2 duration-200">
                {isLoadingComments ? (
                  <div className="text-center py-6">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading comments...</p>
                  </div>
                ) : localCommentsData && localCommentsData.length > 0 ? (
                  <div className="space-y-3">
                   
                    
                    {/* Display comments */}
                    {displayedComments.map((comment) => (
                      <div key={comment.id} className="flex items-center justify-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <img
                          src={comment.publisher?.avatar || '/perimg.png'}
                          alt={comment.publisher?.name || 'User'}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0 max-w-full overflow-hidden">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <span className="font-medium text-sm text-gray-900 block truncate">
                                {comment.publisher?.first_name || 'Unknown'} {comment.publisher?.last_name || ''}
                              </span>
                              <span className="text-xs text-gray-500 block truncate">
                                {comment.time ? new Date(comment.time * 1000).toLocaleDateString() : 'Unknown time'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 break-words leading-relaxed overflow-hidden">
                            {comment.Orginaltext || comment.text || 'No comment text'}
                          </p>
                        </div>
                        <div className="inline-block items-end h-full justify-end space-x-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Show more/less button */}
                    {hasMoreComments && (
                      <button
                        onClick={toggleShowAllComments}
                        className="w-full text-center py-3 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors border-t border-gray-200 mt-4 hover:bg-blue-50 rounded-lg"
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
              placeholder="Comment"
              className="flex-1 bg-transparent text-sm focus:outline-none min-w-0"
            />
            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
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
}

export default memo(PostCard);