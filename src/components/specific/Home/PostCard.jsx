import { memo } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Smile } from 'lucide-react';

const PostCard = ({ user, content, image, likes, comments, shares, saves, timeAgo }) => (
  <div className="bg-white rounded-xl overflow-hidden">
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

export default memo(PostCard);