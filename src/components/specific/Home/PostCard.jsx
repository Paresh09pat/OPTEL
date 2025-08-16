import { memo } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
import { IoBookmark } from "react-icons/io5";


const PostCard = ({ user, content, image, likes, comments, shares, saves, timeAgo, post_id, handleLike, isLiked }) => (
  <div className="bg-white rounded-xl overflow-hidden border border-[#808080] smooth-content-transition" key={post_id}>
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

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 ">
          <button 
            className={`inline-block items-center space-x-2 transition-all duration-200 hover:scale-105 cursor-pointer ${
              isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`} 
            onClick={() => handleLike(post_id, 1)}
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
        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
          <Share className="w-5 h-5" />
        </button>
      
        <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors">
          {saves ? <IoBookmark className="w-5 h-5 text-blue-900" /> :  <Bookmark className="w-5 h-5" />}
         
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

export default memo(PostCard);