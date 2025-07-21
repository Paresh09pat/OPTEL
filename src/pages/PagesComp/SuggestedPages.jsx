import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { LuThumbsUp } from 'react-icons/lu';
import axios from 'axios';

const SuggestedPages = () => {
  const suggestedPagesData = [
    {
      id: 1,
      name: 'Steps by Sana',
      category: 'Bharatnataym Dance',
      likes: '2K+',
      comments: '100+',
      posts: '250+',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'Elite Cricket Academy',
      category: 'Cricket',
      likes: '2K+',
      comments: '100+',
      posts: '250+',
      avatar:
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: 3,
      name: 'CosmicSapphire',
      category: 'Fashion',
      likes: '2K+',
      comments: '100+',
      posts: '250+',
      avatar:
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
    },
  ];

  // Initial liked page(s)
  const [likedPages, setLikedPages] = useState(new Set([2]));
  const [loadingPageId, setLoadingPageId] = useState(null); // to disable individual buttons

  const handleLike = async (pageId) => {
    const isAlreadyLiked = likedPages.has(pageId);
    setLoadingPageId(pageId);

    try {
      // Simulated API call
      const url = isAlreadyLiked
        ? `/api/unlike-page/${pageId}`
        : `/api/like-page/${pageId}`;
      await axios.post(url); // Replace with real API call

      setLikedPages((prev) => {
        const updated = new Set(prev);
        isAlreadyLiked ? updated.delete(pageId) : updated.add(pageId);
        return updated;
      });
    } catch (error) {
      console.error('Error updating like status:', error);
    } finally {
      setLoadingPageId(null);
    }
  };

  return (
    <div className="space-y-6">
      {suggestedPagesData.map((page) => {
        const isLiked = likedPages.has(page.id);
        return (
          <div
            key={page.id}
            className="bg-white rounded-lg border border-gray-300 p-4 sm:p-6"
          >
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={page.avatar}
                  alt={page.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                    {page.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 block sm:hidden">
                    Category:{' '}
                    <span className="font-bold">{page.category}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end w-full sm:w-auto gap-2">
                <button
                  onClick={() => handleLike(page.id)}
                  disabled={loadingPageId === page.id}
                  className={`w-full sm:w-auto px-4 py-2 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base transition
                    ${
                      isLiked
                        ? 'border border-red-500 text-red-600'
                        : 'border border-[#808080] text-black hover:bg-gray-50'
                    }`}
                >
                  {isLiked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <LuThumbsUp className="text-black" />
                  )}
                  <span>{isLiked ? 'Liked Page' : 'Like Page'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm text-gray-600">
              <p className="text-sm text-gray-600 font-medium hidden sm:block">
                Category: <span className="font-bold">{page.category}</span>
              </p>
              <div className="flex flex-wrap gap-4 font-semibold">
                <span>{page.likes} Likes</span>
                <span>{page.comments} Comments</span>
                <span>{page.posts} Posts</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedPages;
