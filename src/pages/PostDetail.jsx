import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PostCard from '../components/specific/Home/PostCard';
import Loader from '../components/loading/Loader';
import { baseUrl } from '../utils/constant';
import { useUser } from '../context/UserContext';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { userData } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem("liked_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [savedPosts, setSavedPosts] = useState(() => {
    const saved = localStorage.getItem("saved_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [imagePopup, setImagePopup] = useState({ show: false, images: [], currentIndex: 0 });

  const buildAuthHeaders = useCallback(() => {
    const accessToken = localStorage.getItem("access_token");
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    return headers;
  }, []);

  const fetchPostData = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/get-data`,
        {
          post_id: parseInt(postId),
          fetch: "post_data,post_comments,post_liked_users,post_wondered_users",
          add_view: 1
        },
        {
          headers: buildAuthHeaders()
        }
      );

      const data = response.data;

      if (data?.api_status === 200 && data?.post_data) {
        setPostData(data.post_data);
        setPostComments(data.post_comments || []);
        
        // Update saved posts if post is saved
        if (data.post_data.is_post_saved) {
          setSavedPosts(prev => {
            const newSet = new Set(prev);
            newSet.add(data.post_data.id);
            localStorage.setItem("saved_posts", JSON.stringify([...newSet]));
            return newSet;
          });
        }
      } else {
        setError('Post not found');
        toast.error('Post not found');
      }
    } catch (error) {
      console.error('Error fetching post data:', error);
      setError(error?.response?.data?.message || 'Failed to load post');
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId, buildAuthHeaders]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const handleLike = async (post_id) => {
    const post = postData;
    if (!post) return;

    const wasLiked = post.is_liked || likedPosts.has(post_id);

    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (wasLiked) {
        newLikedPosts.delete(post_id);
      } else {
        newLikedPosts.add(post_id);
      }
      localStorage.setItem("liked_posts", JSON.stringify([...newLikedPosts]));
      return newLikedPosts;
    });

    setPostData(prev => ({
      ...prev,
      reactions_count: wasLiked
        ? Math.max(0, parseInt(prev.reactions_count || prev.post_likes || 0) - 1)
        : parseInt(prev.reactions_count || prev.post_likes || 0) + 1,
      is_liked: !wasLiked
    }));
  };

  const handleDislike = async (post_id) => {
    handleLike(post_id);
  };

  const fetchComments = async (post_id) => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/posts/${post_id}/comments`,
        {
          params: { per_page: 20 },
          headers: buildAuthHeaders()
        }
      );
      const data = response.data;

      if (data?.ok === true) {
        const fetched =
          (Array.isArray(data?.data?.comments) && data.data.comments) ||
          (Array.isArray(data?.data?.data) && data.data.data) ||
          (Array.isArray(data?.data) && data.data) ||
          [];
        setPostComments(fetched);
        return fetched;
      }
      return [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const savePost = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const wasSaved = savedPosts.has(post_id);

      const response = wasSaved
        ? await axios.delete(`${baseUrl}/api/v1/posts/${post_id}/save`, {
            headers: buildAuthHeaders()
          })
        : await axios.post(`${baseUrl}/api/v1/posts/${post_id}/save`, {}, {
            headers: buildAuthHeaders()
          });

      const data = await response.data;
      if (data?.ok === true) {
        setSavedPosts(prev => {
          const newSavedPosts = new Set(prev);
          if (wasSaved) {
            newSavedPosts.delete(post_id);
          } else {
            newSavedPosts.add(post_id);
          }
          localStorage.setItem("saved_posts", JSON.stringify([...newSavedPosts]));
          return newSavedPosts;
        });

        setPostData(prev => ({
          ...prev,
          is_post_saved: !wasSaved
        }));
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportPost = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      formData.append('action', 'report');
      formData.append('post_id', post_id);
      const response = await fetch(`https://ouptel.com/api/post-actions?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
          "Accept": "application/json"
        },
        body: formData.toString(),
      });
      const data = await response.json();
      if (data?.api_status === 200) {
        toast.success('Post reported successfully');
      } else {
        toast.error('Failed to report post');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Error reporting post');
    } finally {
      setLoading(false);
    }
  };

  const hidePost = async (post_id) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/hide`,
        { post_id: post_id },
        {
          headers: buildAuthHeaders()
        }
      );

      const data = await response.data;
      if (data?.ok === true) {
        toast.success('Post hidden successfully');
        navigate('/');
      } else {
        toast.error(data?.message || 'Failed to hide post');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Error hiding post';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId, reactionType) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/${postId}/reactions`,
        { reaction: reactionType.toString() },
        {
          headers: buildAuthHeaders()
        }
      );
      const data = await response.data;
      
      if (data?.ok === true) {
        const isRemoved = data.data.action === 'removed';
        const totalReactions = Object.values(data.data.reaction_counts).reduce((sum, count) => sum + count, 0);

        setPostData(prev => ({
          ...prev,
          reactions_count: totalReactions,
          is_liked: !isRemoved,
          reaction_counts: data.data.reaction_counts,
          current_reaction: isRemoved ? null : data.data.user_reaction,
          user_reaction: isRemoved ? null : data.data.user_reaction
        }));

        await fetchPostData();
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePollVote = async (postId, optionId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/polls/vote`,
        { id: optionId },
        {
          headers: buildAuthHeaders()
        }
      );

      const data = await response.data;
      if (data?.ok === true || data?.api_status === 200) {
        const updatedOptions = data?.data?.poll_options || data?.poll_options;

        if (updatedOptions && Array.isArray(updatedOptions)) {
          const totalVotes = updatedOptions.reduce((sum, opt) => sum + (opt.votes || 0), 0);
          const optionsWithPercentages = updatedOptions.map(opt => ({
            ...opt,
            percentage: totalVotes > 0 ? ((opt.votes || 0) / totalVotes) * 100 : 0
          }));

          setPostData(prev => ({
            ...prev,
            poll_options: optionsWithPercentages
          }));
        }
        toast.success('Vote submitted successfully');
        await fetchPostData();
      } else {
        toast.error(data?.message || 'Failed to submit vote');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Error submitting vote';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeProps = (post) => {
    const ensureFullUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://ouptel.com/${url.replace(/^\//, '')}`;
    };

    if (post?.post_record_url) {
      const isAudio = post?.post_type === 'audio' ||
        post?.post_record_url.includes('/audio/') ||
        post?.post_record_url.includes('/sounds/') ||
        /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record_url);

      if (isAudio) {
        return { audio: ensureFullUrl(post.post_record_url) };
      }
    }

    if (post?.post_record) {
      const isAudio = post?.post_type === 'audio' ||
        post?.post_record.includes('/audio/') ||
        post?.post_record.includes('/sounds/') ||
        /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record);

      if (isAudio) {
        return { audio: ensureFullUrl(post.post_record) };
      }
    }

    if (post?.album_images && Array.isArray(post.album_images) && post.album_images.length > 0) {
      const processedImages = post.album_images.map(img => ({
        id: img.id,
        image: ensureFullUrl(img.image_url),
        image_org: ensureFullUrl(img.image_url)
      }));

      return {
        image: processedImages[0]?.image || processedImages[0]?.image_org,
        multipleImages: processedImages,
        hasMultipleImages: processedImages.length > 1
      };
    }

    if (post?.post_photo_url) {
      return { image: ensureFullUrl(post.post_photo_url) };
    }

    if (post?.photo_multi && Array.isArray(post.photo_multi) && post.photo_multi.length > 0) {
      const processedImages = post.photo_multi.map(img => ({
        ...img,
        image: ensureFullUrl(img.image),
        image_org: ensureFullUrl(img.image_org)
      }));

      return {
        image: processedImages[0]?.image || processedImages[0]?.image_org,
        multipleImages: processedImages,
        hasMultipleImages: processedImages.length > 1
      };
    }

    if (post?.postPhoto) {
      return { image: ensureFullUrl(post.postPhoto) };
    }

    if (post?.postFile_full) {
      const url = ensureFullUrl(post.postFile_full);
      const fileName = post.postFileName || '';
      const ext = fileName.split('.').pop()?.toLowerCase() || '';

      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "tiff", "tif"];
      const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "m4v"];
      const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "wma", "m4a"];

      const urlLooksLikeImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg|tiff|tif)/i.test(url) ||
        url.includes('image') ||
        url.includes('photo');

      const urlLooksLikeAudio = /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(url) ||
        url.includes('audio') ||
        url.includes('sound') ||
        url.includes('posts/audio');

      if (imageExtensions.includes(ext) || urlLooksLikeImage) {
        return { image: url };
      } else if (videoExtensions.includes(ext)) {
        return { video: url };
      } else if (audioExtensions.includes(ext) || urlLooksLikeAudio) {
        return { audio: url };
      } else if (!imageExtensions.includes(ext) && !videoExtensions.includes(ext) && !audioExtensions.includes(ext)) {
        return { file: url };
      }
    }

    return {};
  };

  const openImagePopup = (images, currentIndex = 0) => {
    setImagePopup({ show: true, images, currentIndex });
  };

  const closeImagePopup = () => {
    setImagePopup({ show: false, images: [], currentIndex: 0 });
  };

  const nextImage = () => {
    setImagePopup(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setImagePopup(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (imagePopup.show) {
        if (e.key === 'Escape') {
          closeImagePopup();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [imagePopup.show]);

  const getNewsFeed = async () => {
    await fetchPostData();
  };

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  if (loading && !postData) {
    return <Loader />;
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The post you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const post = postData;
  const postIdNum = post.id || post.post_id;

  return (
    <>
      {loading && <Loader />}
      
      <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
        <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
          <div className="mb-4">
           
          </div>

          <div className="mb-4 md:mb-6">
            <PostCard
              key={postIdNum}
              post_id={postIdNum}
              user={post?.publisher}
              content={post?.postText || post?.post_text}
              blog={post?.blog}
              iframelink={post?.postYoutube || post?.post_youtube}
              postfile={post?.postFile || post?.post_file}
              postFileName={post?.postFileName}
              {...getFileTypeProps(post)}
              likes={post?.reactions_count || post?.post_likes || 0}
              comments={post?.comments_count || post?.post_comments || 0}
              shares={post?.shares_count || post?.post_shares || 0}
              saves={post?.is_post_saved}
              timeAgo={post?.time ? formatTimeAgo(post.time) : 'Unknown'}
              handleLike={handleLike}
              handleDislike={handleDislike}
              isLiked={post?.is_liked || likedPosts.has(postIdNum)}
              isSaved={savedPosts.has(postIdNum)}
              fetchComments={fetchComments}
              commentsData={postComments}
              savePost={savePost}
              reportPost={reportPost}
              hidePost={hidePost}
              getNewsFeed={getNewsFeed}
              openImagePopup={openImagePopup}
              handleReaction={handleReaction}
              postReaction={post?.user_reaction || post?.current_reaction}
              postReactionCounts={post?.reaction_counts}
              currentReaction={post?.current_reaction || post?.user_reaction}
              userReaction={post?.user_reaction}
              postType={post?.postType || post?.post_type}
              pollOptions={post?.poll_options}
              handlePollVote={(optionId) => handlePollVote(postIdNum, optionId)}
              isPollLoading={loading}
            />
          </div>
        </div>
      </div>

      {/* Image Popup/Modal */}
      {imagePopup.show && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <button
              onClick={closeImagePopup}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>

            {imagePopup.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ›
                </button>
              </>
            )}

            <img
              src={imagePopup.images[imagePopup.currentIndex]?.image || imagePopup.images[imagePopup.currentIndex]?.image_org}
              alt={`Image ${imagePopup.currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              style={{ maxHeight: '90vh' }}
            />

            {imagePopup.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
                {imagePopup.currentIndex + 1} / {imagePopup.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostDetail;

