import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { LuThumbsUp } from 'react-icons/lu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { baseUrl } from '../../utils/constant';

const SuggestedPages = ({ pages = [], loading = false, onRefresh }) => {
  const navigate = useNavigate();
  const [likedPages, setLikedPages] = useState(new Set());
  const [loadingPageId, setLoadingPageId] = useState(null);

  const handleLike = async (pageId, isAlreadyLiked) => {
    setLoadingPageId(pageId);

    try {
      const accessToken = localStorage.getItem('access_token');
      
      const response = await axios.post(
        `${baseUrl}/api/v1/pages/like`,
        { page_id: parseInt(pageId) },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.api_status === 200 || response.data?.ok === true) {
        setLikedPages((prev) => {
          const updated = new Set(prev);
          isAlreadyLiked ? updated.delete(pageId) : updated.add(pageId);
          return updated;
        });
        toast.success(isAlreadyLiked ? 'Page unliked' : 'Page liked successfully');
        
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error(response.data?.message || 'Failed to update like status');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      toast.error(error.response?.data?.message || 'Failed to update like status');
    } finally {
      setLoadingPageId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading suggested pages...</span>
        </div>
      </div>
    );
  }

  if (!SuggestedPages || SuggestedPages.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Suggested Pages</h3>
          <p className="text-gray-600">Check back later for page suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pages.map((page) => {
        const isLiked = likedPages.has(page.page_id) || page.is_liked;
        return (
          <div
            key={page.page_id}
            className="bg-white rounded-lg border border-gray-300 p-4 sm:p-6 cursor-pointer hover:shadow-sm transition-shadow"
            onClick={() => navigate(`/page/${page.page_id}`)}
          >
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={page.avatar_url || '/icons/page.png'}
                  alt={page.page_name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/icons/page.png';
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                      {page.page_title || page.page_name}
                    </h3>
                    {page.verified && (
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">@{page.page_name}</p>
                  <p className="text-sm text-gray-600 mt-1 block sm:hidden">
                    Category:{' '}
                    <span className="font-bold">{page.category_name || 'General'}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end w-full sm:w-auto gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(page.page_id, isLiked);
                  }}
                  disabled={loadingPageId === page.page_id}
                  className={`w-full sm:w-auto px-4 py-2 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base transition disabled:opacity-50 ${
                    isLiked
                      ? 'border border-red-500 text-red-600'
                      : 'border border-[#808080] text-black hover:bg-gray-50'
                  }`}
                >
                  {loadingPageId === page.page_id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : isLiked ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <LuThumbsUp className="text-black" />
                  )}
                  <span>{isLiked ? 'Liked Page' : 'Like Page'}</span>
                </button>
              </div>
            </div>

            {/* Description */}
            {page.description && (
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{page.description}</p>
            )}

            {/* Bottom Info */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm text-gray-600">
              <p className="text-sm text-gray-600 font-medium hidden sm:block">
                Category: <span className="font-bold">{page.category_name || 'General'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {page.owner && (
                  <span className="flex items-center gap-1">
                    <img 
                      src={page.owner.avatar_url || '/icons/user.png'} 
                      alt={page.owner.username}
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/icons/user.png';
                      }}
                    />
                    <span>by @{page.owner.username}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedPages;
