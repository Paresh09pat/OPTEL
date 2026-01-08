import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { getCategoryName } from '../constants/blogCategories';

const BlogDetailed = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('access_token'); 
  const navigate = useNavigate();

  const getBlog = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/v1/blogs/${blogId}?increment_view=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      const responseData = await response.json();
      console.log(responseData, 'data-detailed');
      
      if (!response.ok || responseData.api_status !== 200) {
        // Extract error message from different possible response formats
        const errorMessage = 
          responseData.errors?.error_text || 
          responseData.api_text || 
          responseData.message || 
          'Failed to fetch blog';
        throw new Error(errorMessage);
      }
      
      if (!responseData.data) {
        throw new Error('Blog data not found');
      }
      
      setBlog(responseData.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'An error occurred while loading the blog');
      setLoading(false);
    }
  };

  // Format date to relative time
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };


  // Handle share
  const handleShare = async () => {
    try {
      // Construct frontend URL instead of using backend URL
      const frontendUrl = `${window.location.origin}/blog/${blogId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: blog?.title,
          text: blog?.description,
          url: frontendUrl
        });
        
        // Increment share count
        setBlog(prev => ({
          ...prev,
          shares: (prev.shares || 0) + 1
        }));
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(frontendUrl);
        toast.success('Link copied to clipboard!');
        
        setBlog(prev => ({
          ...prev,
          shares: (prev.shares || 0) + 1
        }));
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        // Still copy to clipboard as fallback
        try {
          const frontendUrl = `${window.location.origin}/blog/${blogId}`;
          await navigator.clipboard.writeText(frontendUrl);
          toast.success('Link copied to clipboard!');
        } catch (clipboardError) {
          toast.error('Failed to share');
        }
      }
    }
  };

  // Handle comment (placeholder - can be expanded later)
  const handleComment = () => {
    // Scroll to comments section or open comment modal
    toast.info('Comment feature coming soon!');
  };



  useEffect(() => {
    getBlog();
  }, []);


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-red-600 font-semibold mb-1">{error}</p>
            <p className="text-gray-500 text-sm">
              {error.toLowerCase().includes('not found') || error.toLowerCase().includes('article not found')
                ? 'The blog you are looking for does not exist or has been removed.'
                : 'Something went wrong while loading this blog.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
            <p className="text-gray-500 text-sm">
              The blog you are looking for does not exist or has been removed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9] py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Thumbnail */}
          {(blog?.thumbnail_url || blog?.thumbnail) && (
            <div className="w-full h-64 md:h-96 bg-gray-100 overflow-hidden">
              <img
                src={blog?.thumbnail_url || blog?.thumbnail}
                alt={blog?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://admin.ouptel.in/images/placeholders/blog-image.svg';
                }}
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog?.title}
            </h1>

            {/* Author + time */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
              <img
                src={blog?.author?.avatar_url || blog?.author?.avatar || '/icons/default-avatar.png'}
                alt={blog?.author?.name || blog?.author?.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0"
                onError={(e) => {
                  e.target.src = '/icons/default-avatar.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">
                    {blog?.author?.name || blog?.author?.username}
                  </p>
                  {blog?.author?.verified && (
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {blog?.posted_at ? formatTimeAgo(blog.posted_at) : ''}
                  {blog?.category?.id && ` • ${getCategoryName(blog.category.id)}`}
                  {blog?.status_text && ` • ${blog.status_text}`}
                </p>
              </div>
            </div>

            {/* Description */}
            {blog?.description && (
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {blog.description}
              </p>
            )}

            {/* Full content */}
            {blog?.content && (
              <div className="mb-8 text-gray-800 leading-relaxed whitespace-pre-line prose prose-lg max-w-none">
                <div className="text-base md:text-lg">
                  {blog.content}
                </div>
              </div>
            )}

            {/* Tags */}
            {blog?.tags && blog.tags.length > 0 && (
              <div className="mb-8 flex gap-2 flex-wrap">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-full font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between gap-4">
                {/* Like Button */}
               

                {/* Comment Button */}
                <button
                  onClick={handleComment}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{blog?.comments || 0}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200 transition-all duration-200"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>

                {/* Views (Read-only) */}
                <div className="flex items-center gap-2 text-gray-500 ml-auto">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-medium">{blog?.views || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailed