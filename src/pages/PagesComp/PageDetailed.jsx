import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/loading/Loader';
import { baseUrl } from '../../utils/constant';
import { HiUsers } from 'react-icons/hi';
import { FaHeart, FaRegHeart, FaGlobe, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';
import CreatePostSection from '../../components/specific/Home/CreatePostSection';
import Avatar from '../../components/Avatar';
import PostCard from '../../components/specific/Home/PostCard';

const DEFAULT_AVATAR = 'https://admin.ouptel.in/images/placeholders/page-avatar.svg';
const DEFAULT_USER_AVATAR = 'https://admin.ouptel.in/images/placeholders/user-avatar.svg';

const PageDetailed = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);
  const [liking, setLiking] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [ownerAvatarError, setOwnerAvatarError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'about', 'info'

  const accessToken = useMemo(() => localStorage.getItem('access_token'), []);

  // Handler for post reactions
  const handlePostReaction = useCallback(async (postId, reactionType) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/${postId}/reactions`,
        { reaction: reactionType },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.ok === true || response.data?.api_status === 200) {
        toast.success(response.data?.message || 'Reaction added successfully');
        // Refetch posts to update reaction counts
        fetchPagePosts(currentPage, false);
      } else {
        toast.error(response.data?.message || 'Failed to add reaction');
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error(error?.response?.data?.message || 'Error adding reaction');
    }
  }, [accessToken, currentPage]);

  // Handler for saving/unsaving posts
  const handleSavePost = useCallback(async (postId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/save`,
        { post_id: postId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.ok === true || response.data?.api_status === 200) {
        toast.success(response.data?.message || 'Post saved successfully');
        // Refetch posts to update saved status
        fetchPagePosts(currentPage, false);
      } else {
        toast.error(response.data?.message || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error?.response?.data?.message || 'Error saving post');
    }
  }, [accessToken, currentPage]);

  // Handler for reporting posts
  const handleReportPost = useCallback(async (postId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/report`,
        { post_id: postId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.ok === true || response.data?.api_status === 200) {
        toast.success(response.data?.message || 'Post reported successfully');
      } else {
        toast.error(response.data?.message || 'Failed to report post');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error(error?.response?.data?.message || 'Error reporting post');
    }
  }, [accessToken]);

  // Handler for hiding posts
  const handleHidePost = useCallback(async (postId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/hide`,
        { post_id: postId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.ok === true || response.data?.api_status === 200) {
        toast.success('Post hidden successfully');
        // Refetch posts to remove hidden post
        fetchPagePosts(currentPage, false);
      } else {
        toast.error(response.data?.message || 'Failed to hide post');
      }
    } catch (error) {
      console.error('Error hiding post:', error);
      toast.error(error?.response?.data?.message || 'Error hiding post');
    }
  }, [accessToken, currentPage]);

  // Handler for poll voting
  const handlePollVote = useCallback(async (postId, optionId) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/${postId}/poll/vote`,
        { option_id: optionId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.ok === true || response.data?.api_status === 200) {
        toast.success(response.data?.message || 'Vote recorded successfully');
        // Refetch posts to update poll results
        fetchPagePosts(currentPage, false);
      } else {
        toast.error(response.data?.message || 'Failed to vote');
      }
    } catch (error) {
      console.error('Error voting on poll:', error);
      toast.error(error?.response?.data?.message || 'Error voting on poll');
    }
  }, [accessToken, currentPage]);

  // Handler for opening image popup (placeholder - implement if needed)
  const handleOpenImagePopup = useCallback((images, index) => {
    // TODO: Implement image popup/lightbox if needed
    console.log('Open image popup:', images, index);
  }, []);

  useEffect(() => {
    const fetchPage = async () => {
      if (!pageId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${baseUrl}/api/v1/pages/${pageId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });

        const data = await res.json().catch(() => null);
        console.log('Page API response:', data);
        
        if (!res.ok || data?.api_status !== 200) {
          throw new Error(data?.message || 'Failed to fetch page');
        }

        setPage(data?.data);
      } catch (e) {
        setError(e?.message || 'Failed to fetch page');
        toast.error(e?.message || 'Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId, accessToken]);

  // Fetch page posts with pagination
  const fetchPagePosts = async (page = 1, append = false) => {
    if (!pageId) return;
    setLoadingPosts(true);

    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/pages`,
        {
          params: {
            include_posts: true,
            page: page,
            per_page: 10
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.data) {
        // Find the current page in the response
        const currentPageData = response.data.data.find(p => p.page_id === parseInt(pageId));
        
        if (currentPageData && currentPageData.posts) {
          if (append) {
            setPosts(prev => [...prev, ...currentPageData.posts]);
          } else {
            setPosts(currentPageData.posts);
          }
          
          // Update pagination info
          const meta = response.data.meta;
          if (meta) {
            setHasMorePosts(meta.current_page < meta.last_page);
            setTotalPosts(currentPageData.posts_count || 0);
          }
        } else {
          if (!append) {
            setPosts([]);
          }
          setHasMorePosts(false);
        }
      }
    } catch (error) {
      console.error('Error fetching page posts:', error);
      if (!append) {
        setPosts([]);
      }
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (pageId && accessToken) {
      fetchPagePosts(1, false);
    }
  }, [pageId, accessToken]);

  // Load more posts function
  const loadMorePosts = useCallback(() => {
    if (!loadingPosts && hasMorePosts) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPagePosts(nextPage, true);
    }
  }, [loadingPosts, hasMorePosts, currentPage, pageId, accessToken]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts]);

  const handleLikePage = async () => {
    if (!page || liking) return;
    setLiking(true);

    const previousLikedState = page.is_liked;
    const previousLikesCount = page.likes_count || 0;

    // Optimistic update
    const isNowLiked = !previousLikedState;
    setPage(prev => ({
      ...prev,
      is_liked: isNowLiked,
      likes_count: isNowLiked ? previousLikesCount + 1 : Math.max(0, previousLikesCount - 1)
    }));

    try {
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
        toast.success(isNowLiked ? 'Page liked successfully' : 'Page unliked successfully');
      } else {
        // Revert on failure
        setPage(prev => ({
          ...prev,
          is_liked: previousLikedState,
          likes_count: previousLikesCount
        }));
        toast.error(response.data?.message || 'Failed to update like status');
      }
    } catch (error) {
      console.error('Error liking/unliking page:', error);
      // Revert on error
      setPage(prev => ({
        ...prev,
        is_liked: previousLikedState,
        likes_count: previousLikesCount
      }));
      toast.error(error.response?.data?.message || 'Failed to update like status');
    } finally {
      setLiking(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Page not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      {/* Header */}
      <div className="w-full sticky top-0 z-10 bg-[#EDF6F9] pt-8 pb-4 px-4 md:px-7">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Cover */}
        <div className="w-full h-64 md:h-80 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl overflow-hidden mb-6 shadow-lg">
          {page.cover_url && !coverError ? (
            <img 
              src={page.cover_url} 
              alt={page.page_title} 
              className="w-full h-full object-cover"
              onError={() => setCoverError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-6xl">📄</span>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0 border-4 border-white bg-gray-100">
              {!avatarError ? (
                <img 
                  src={page.avatar_url || page.avatar || DEFAULT_AVATAR} 
                  alt={page.page_title} 
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-4xl">📄</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{page.page_title}</h1>
                {page.verified && (
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-gray-500 mb-2">@{page.page_name}</p>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {page.category_name && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                    {page.category_name}
                  </span>
                )}
                {page.sub_category_name && (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                    {page.sub_category_name}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 flex-wrap text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <HiUsers className="w-5 h-5 text-[#3D8CFA]" />
                  <span className="font-semibold">{page.likes_count || 0} Likes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-[#3D8CFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="font-semibold">{page.posts_count || 0} Posts</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              {/* Like/Unlike Button */}
              <button
                onClick={handleLikePage}
                disabled={liking}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 ${
                  page.is_liked
                    ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                    : 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {liking ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : page.is_liked ? (
                  <FaHeart className="w-5 h-5" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
                <span>{page.is_liked ? 'Liked' : 'Like Page'}</span>
              </button>

              {/* Edit Page Button (only for page owner) */}
              {page.is_owner && (
                <button
                  onClick={() => navigate(`/page/${pageId}/settings`)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <MdEdit className="w-5 h-5" />
                  <span>Edit Page</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Create Post Section - Only show if user can post or is owner */}
        {(page.is_owner || page.can_post === 'enable') && (
          <div className="mb-6">
            <CreatePostSection 
              fetchNewFeeds={fetchPagePosts}
              showNotification={(message, type) => {
                if (type === 'success') {
                  toast.success(message);
                } else {
                  toast.error(message);
                }
              }}
              pageId={pageId}
              isPagePost={true}
            />
          </div>
        )}

        {/* About Section */}
        {(page.about || page.page_description) && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {page.about || page.page_description}
            </p>
          </div>
        )}

        {/* Contact & Info Section */}
        {(page.website || page.phone || page.address) && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {page.website && (
                <a 
                  href={page.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaGlobe className="w-5 h-5 text-blue-500" />
                  <span className="break-all">{page.website}</span>
                </a>
              )}
              {page.phone && (
                <a 
                  href={`tel:${page.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaPhone className="w-5 h-5 text-green-500" />
                  <span>{page.phone}</span>
                </a>
              )}
              {page.address && (
                <div className="flex items-start gap-3 text-gray-700">
                  <FaMapMarkerAlt className="w-5 h-5 text-red-500 mt-0.5" />
                  <span>{page.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Owner Section */}
        {page.owner && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Page Owner</h2>
            <div 
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors -m-3"
              onClick={() => navigate(`/profile/${page.owner.user_id}`)}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                {!ownerAvatarError ? (
                  <img 
                    src={page.owner.avatar_url || page.owner.avatar || DEFAULT_USER_AVATAR} 
                    alt={page.owner.name}
                    className="w-full h-full object-cover"
                    onError={() => setOwnerAvatarError(true)}
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{page.owner.name}</h3>
                  {page.owner.verified && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-500 text-sm">@{page.owner.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Posts {totalPosts > 0 && `(${totalPosts})`}
          </h2>
          {loadingPosts && posts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.post_id || post.id}
                  user={post.author || post.publisher || {
                    user_id: post.user_id,
                    name: post.user_name || 'Unknown User',
                    avatar_url: post.user_avatar_url,
                    avatar: post.user_avatar
                  }}
                  content={post.post_text || post.Orginaltext || ''}
                  image={post.post_photo_url || post.postPhoto}
                  video={post.post_video_url || post.postVideo}
                  audio={post.post_audio_url || post.postAudio}
                  file={post.post_file_url || post.postFile}
                  likes={post.reactions_count || post.post_likes || 0}
                  comments={post.comments_count || post.post_comments || 0}
                  shares={post.shares_count || post.post_shares || 0}
                  saves={post.saves_count || 0}
                  timeAgo={post.created_at_human || post.time_text || 'Just now'}
                  post_id={post.post_id || post.id}
                  handleLike={() => handlePostReaction(post.post_id || post.id, 1)}
                  handleDislike={() => {}}
                  isLiked={post.is_reacted || post.is_liked || false}
                  commentsData={post.comments || []}
                  savePost={handleSavePost}
                  isSaved={post.is_saved || false}
                  blog={post.blog}
                  multipleImages={post.album_images || post.album || []}
                  hasMultipleImages={post.album_images && post.album_images.length > 0}
                  reportPost={handleReportPost}
                  hidePost={handleHidePost}
                  iframelink={post.youtube || post.iframe_link || ''}
                  postfile={post.post_file_url || post.postFile || ''}
                  postFileName={post.post_file_name || post.postFileName || ''}
                  getNewsFeed={() => fetchPagePosts(currentPage, false)}
                  openImagePopup={handleOpenImagePopup}
                  handleReaction={handlePostReaction}
                  postReaction={post.reaction || post.user_reaction}
                  postReactionCounts={post.reaction_counts || {}}
                  currentReaction={post.reaction || post.user_reaction}
                  userReaction={post.reaction || post.user_reaction}
                  postType={post.post_type || 'post'}
                  pollOptions={post.poll_options || post.options || []}
                  handlePollVote={(optionId) => handlePollVote(post.post_id || post.id, optionId)}
                  isPollLoading={false}
                  colorId={post.color_id}
                  colorData={post.color_data}
                  feeling={post.feeling}
                  isFeelingPost={post.is_feeling_post || false}
                />
              ))}

              {/* Loading more indicator */}
              {loadingPosts && posts.length > 0 && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Loading more posts...</span>
                </div>
              )}

              {/* No more posts indicator */}
              {!hasMorePosts && posts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No more posts to load</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-500 text-lg">No posts yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to post on this page!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageDetailed;

