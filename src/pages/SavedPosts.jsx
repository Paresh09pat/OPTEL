import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PostCard from '../components/specific/Home/PostCard';
import Loader from '../components/loading/Loader';
import { baseUrl } from '../utils/constant';

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState(() => {
    const saved = localStorage.getItem("liked_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [savedPostsSet, setSavedPostsSet] = useState(() => {
    const saved = localStorage.getItem("saved_posts");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [postComments, setPostComments] = useState({});
  const [postReactions, setPostReactions] = useState({});
  const [imagePopup, setImagePopup] = useState({ show: false, images: [], currentIndex: 0 });

  // Fetch saved posts
  const fetchSavedPosts = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(
        `${baseUrl}/api/v1/saved-posts`,
        {
          params: { per_page: 20 },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      );

      const data = response.data;
      if (data?.ok === true && data?.data?.posts) {
        setSavedPosts(data.data.posts);
        
        // Load reactions for all posts
        await loadAllPostReactions(data.data.posts);
      } else {
        toast.error(data?.message || 'Failed to fetch saved posts');
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
      toast.error(error?.response?.data?.message || 'Error loading saved posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load reactions for all posts
  const loadAllPostReactions = async (posts) => {
    if (!posts || posts.length === 0) return;

    try {
      const reactionPromises = posts.map(async (post) => {
        if (post.id) {
          const reactionData = await getPostReaction(post.id);
          return { postId: post.id, reactionData };
        }
        return null;
      });

      const results = await Promise.all(reactionPromises);

      const newPostReactions = {};
      results.forEach(result => {
        if (result && result.reactionData?.ok === true) {
          newPostReactions[result.postId] = result.reactionData.data?.user_reaction || null;
        }
      });

      setPostReactions(prev => ({ ...prev, ...newPostReactions }));
    } catch (error) {
      console.error('Error loading post reactions:', error);
    }
  };

  const getPostReaction = async (post_id) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(`${baseUrl}/api/v1/posts/${post_id}/reactions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.data;
      return data;
    } catch (error) {
      console.error('Error getting post reaction:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  // getFileTypeProps helper function
  const getFileTypeProps = (post) => {
    const ensureFullUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `https://ouptel.com/${url.replace(/^\//, '')}`;
    };

    // Handle audio posts with post_record_url
    if (post?.post_record_url) {
      const isAudio = post?.post_type === 'audio' || 
                      post?.post_record_url.includes('/audio/') ||
                      post?.post_record_url.includes('/sounds/') ||
                      /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record_url);
      
      if (isAudio) {
        return { audio: ensureFullUrl(post.post_record_url) };
      }
    }

    // Handle audio posts with post_record
    if (post?.post_record) {
      const isAudio = post?.post_type === 'audio' || 
                      post?.post_record.includes('/audio/') ||
                      post?.post_record.includes('/sounds/') ||
                      /\.(mp3|wav|ogg|aac|flac|wma|m4a)/i.test(post.post_record);
      
      if (isAudio) {
        return { audio: ensureFullUrl(post.post_record) };
      }
    }

    // Handle album_images structure
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

    // Handle single post_photo_url
    if (post?.post_photo_url) {
      return { image: ensureFullUrl(post.post_photo_url) };
    }

    // Handle photo_multi array
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

    // Handle postPhoto
    if (post?.postPhoto) {
      return { image: ensureFullUrl(post.postPhoto) };
    }

    // Handle file attachments
    if (post?.post_file_url) {
      const url = ensureFullUrl(post.post_file_url);
      const fileName = post.post_file || '';
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

  // Handler functions
  const handleLike = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(`${baseUrl}/api/v1/posts/${post_id}/reactions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          "Accept": "application/json"
        },
      });
      const data = await response.data;
      if (data?.ok === true) {
        const wasLiked = likedPosts.has(post_id);
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

        setSavedPosts(prev =>
          prev.map(post =>
            post.id === post_id
              ? {
                ...post,
                total_reactions: wasLiked
                  ? Math.max(0, parseInt(post.total_reactions || 0) - 1)
                  : parseInt(post.total_reactions || 0) + 1,
              }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error handling like:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async (post_id) => {
    // Similar to handleLike but for dislike
    await handleLike(post_id);
  };

  const savePost = async (post_id) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const wasSaved = savedPostsSet.has(post_id);

      const response = wasSaved
        ? await axios.delete(`${baseUrl}/api/v1/posts/${post_id}/save`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              "Accept": "application/json"
            },
          })
        : await axios.post(`${baseUrl}/api/v1/posts/${post_id}/save`, {}, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              "Accept": "application/json"
            },
          });

      const data = await response.data;
      if (data?.ok === true) {
        setSavedPostsSet(prev => {
          const newSavedPosts = new Set(prev);
          if (wasSaved) {
            newSavedPosts.delete(post_id);
          } else {
            newSavedPosts.add(post_id);
          }
          localStorage.setItem("saved_posts", JSON.stringify([...newSavedPosts]));
          return newSavedPosts;
        });

        // Remove from saved posts list if unsaved
        if (wasSaved) {
          setSavedPosts(prev => prev.filter(post => post.id !== post_id));
        } else {
          setSavedPosts(prev =>
            prev.map(post =>
              post.id === post_id
                ? { ...post, is_saved: true }
                : post
            )
          );
        }
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
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.post(
        `${baseUrl}/api/v1/posts/hide`,
        { post_id: post_id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            "Accept": "application/json"
          },
        }
      );

      const data = await response.data;
      if (data?.ok === true) {
        setSavedPosts(prev => prev.filter(post => post.id !== post_id));
        toast.success('Post hidden successfully');
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

  const fetchComments = async (post_id) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(`${baseUrl}/api/v1/posts/${post_id}/comments`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          "Accept": "application/json"
        },
      });
      const data = await response.data;

      if (data?.ok === true) {
        setPostComments(prev => {
          const newState = {
            ...prev,
            [post_id]: data.data.comments || data.data.data || data.data || []
          };
          return newState;
        });
        return data.data.comments || data.data.data || data.data || [];
      } else {
        setPostComments(prev => ({
          ...prev,
          [post_id]: []
        }));
        return [];
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const handleReaction = async (postId, reactionType) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");

      const response = await axios.post(
        `${baseUrl}/api/v1/posts/${postId}/reactions`,
        { reaction: reactionType.toString() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.data;
      
      if (data?.ok === true) {
        const isRemoved = data.data.action === 'removed';
        const totalReactions = Object.values(data.data.reaction_counts).reduce((sum, count) => sum + count, 0);

        setSavedPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                ...post,
                total_reactions: totalReactions,
                reaction_counts: data.data.reaction_counts,
                user_reaction: isRemoved ? null : data.data.user_reaction
              }
              : post
          )
        );

        setPostReactions(prev => ({
          ...prev,
          [postId]: isRemoved ? null : data.data.user_reaction
        }));

        toast.success(
          isRemoved
            ? `${data.data.reaction_name} reaction removed!`
            : `${data.data.reaction_name} reaction added!`
        );
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast.error('Error adding reaction');
    } finally {
      setLoading(false);
    }
  };

  const openImagePopup = (images, currentIndex = 0) => {
    setImagePopup({
      show: true,
      images: images,
      currentIndex: currentIndex
    });
  };

  const closeImagePopup = useCallback(() => {
    setImagePopup({ show: false, images: [], currentIndex: 0 });
  }, []);

  const nextImage = useCallback(() => {
    setImagePopup(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  }, []);

  const prevImage = useCallback(() => {
    setImagePopup(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }));
  }, []);

  // Keyboard navigation for image popup
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
  }, [imagePopup.show, prevImage, nextImage, closeImagePopup]);

  const getNewsFeed = () => {
    fetchSavedPosts();
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
      {loading && <Loader />}
      
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Saved Posts</h1>
          <p className="text-gray-600">Access all your saved posts and bookmarks.</p>
        </div>

        {savedPosts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No saved posts yet</p>
            <p className="text-gray-400 text-sm mt-2">Posts you save will appear here</p>
          </div>
        ) : (
          <div className="mb-4 md:mb-6 mt-4 flex flex-col gap-4 md:gap-6 smooth-content-transition">
            {savedPosts.map((post) => {
              const postId = post?.id || post?.post_id;
              const commentsForPost = postComments[postId] || [];

              return (
                <PostCard
                  key={postId}
                  post_id={postId}
                  user={post?.author}
                  content={post?.post_text || post?.postText}
                  blog={post?.blog}
                  iframelink={post?.post_youtube || post?.postYoutube}
                  postfile={post?.post_file_url || post?.post_file || post?.postFile}
                  postFileName={post?.post_file || post?.postFileName}
                  {...getFileTypeProps(post)}
                  likes={post?.total_reactions || post?.reactions_count || post?.post_likes || 0}
                  comments={post?.comments_count || post?.post_comments || 0}
                  shares={post?.shares_count || post?.post_shares || 0}
                  saves={post?.is_saved}
                  timeAgo={post?.created_at_human || post?.post_created_at}
                  handleLike={handleLike}
                  handleDislike={handleDislike}
                  isLiked={likedPosts.has(postId) || post?.is_liked}
                  isSaved={savedPostsSet.has(postId) || post?.is_saved}
                  commentsData={commentsForPost}
                  savePost={savePost}
                  reportPost={reportPost}
                  hidePost={hidePost}
                  getNewsFeed={getNewsFeed}
                  openImagePopup={openImagePopup}
                  handleReaction={handleReaction}
                  postReaction={postReactions[postId]}
                  postReactionCounts={post?.reaction_counts}
                  currentReaction={post?.user_reaction}
                  userReaction={post?.user_reaction}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Image Popup Modal */}
      {imagePopup.show && imagePopup.images.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeImagePopup}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeImagePopup();
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {imagePopup.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <img
              src={imagePopup.images[imagePopup.currentIndex]?.image || imagePopup.images[imagePopup.currentIndex]?.image_org || imagePopup.images[imagePopup.currentIndex]}
              alt={`Image ${imagePopup.currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {imagePopup.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                {imagePopup.currentIndex + 1} / {imagePopup.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
