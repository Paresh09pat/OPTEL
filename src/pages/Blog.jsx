import React, { useCallback, useEffect, useRef, useState } from "react";
import BlogCard from "../components/BlogCard";
import MyBlogCard from "../components/MyBlogCard";
import Loader from "../components/loading/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { baseUrl } from "../utils/constant";

const Blog = () => {
  const [session] = useState(localStorage.getItem("session_id"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all"); // "all" or "my"

  const navigate = useNavigate();

  // Fetch blog details by ID
  const fetchBlogDetails = async (blogId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/blogs/${blogId}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data?.data || data;
      }
    } catch (error) {
      console.error(`Error fetching blog details for ${blogId}:`, error);
    }
    return null;
  };

  // Transform feed item to blog format
  const transformFeedItemToBlog = async (feedItem) => {
    // If it's already in blog format (from my-articles), return as is
    if (feedItem.title && feedItem.description) {
      return feedItem;
    }

    // If post_type is "blog" but we don't have blog details, try to fetch them
    if (feedItem.post_type === "blog" && !feedItem.title) {
      const blogId = feedItem.post_id || feedItem.id;
      const blogDetails = await fetchBlogDetails(blogId);
      if (blogDetails) {
        return {
          ...blogDetails,
          id: blogId,
          user: feedItem.author ? {
            username: feedItem.author.username || feedItem.author.name,
            avatar_url: feedItem.author.avatar_url,
            avatar: feedItem.author.avatar_url,
          } : blogDetails.user,
          views: feedItem.views_count || blogDetails.views || 0,
          shares: feedItem.shares_count || blogDetails.shares || 0,
          comments: feedItem.comments_count || blogDetails.comments || 0,
          reactions: feedItem.reactions_count || blogDetails.reactions || 0,
        };
      }
    }

    // Transform feed item to blog format (fallback)
    return {
      id: feedItem.post_id || feedItem.id,
      title: feedItem.post_text || feedItem.post_link_title || 'Untitled Blog',
      description: feedItem.post_text || feedItem.post_link_content || '',
      excerpt: feedItem.post_text || feedItem.post_link_content || '',
      content: feedItem.post_text || '',
      category: feedItem.category || 0,
      thumbnail: feedItem.post_photo_url || feedItem.post_link_image || '/icons/blog.png',
      tags: feedItem.tags || [],
      posted: feedItem.time || feedItem.created_at,
      posted_at: feedItem.created_at || new Date().toISOString(),
      active: true,
      views: feedItem.views_count || 0,
      shares: feedItem.shares_count || 0,
      comments: feedItem.comments_count || 0,
      reactions: feedItem.reactions_count || 0,
      url: feedItem.url || '',
      user: feedItem.author ? {
        username: feedItem.author.username || feedItem.author.name,
        avatar_url: feedItem.author.avatar_url,
        avatar: feedItem.author.avatar_url,
      } : null,
    };
  };

  const getBlogs = async (pageNum, mode = viewMode) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching page: ${pageNum}, mode: ${mode}`); // Debug log

      const accessToken = localStorage.getItem("access_token");
      const headers = { "Content-Type": "application/json" };
      
      // Add Authorization header for authenticated requests
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      let url;
      if (mode === "my") {
        // My blogs endpoint - note: this endpoint might not support pagination
        url = `${import.meta.env.VITE_API_URL}/api/v1/blogs/my-articles`;
      } else {
        // New feed API for all blogs with pagination
        const perPage = 10;
        url = `${import.meta.env.VITE_API_URL}/api/v1/new-feed?filter=blogs&per_page=${perPage}&page=${pageNum}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log

      let newBlogs = [];
      
      if (mode === "my") {
        // My blogs uses "blogs" key
        newBlogs = data?.blogs || [];
      } else {
        // New feed API uses "data" key and returns feed items
        const feedItems = data?.data || [];
        // Filter for blog posts only and transform to blog format
        const blogPromises = feedItems
          .filter(item => item.post_type === "blog")
          .map(transformFeedItemToBlog);
        
        // Wait for all transformations (including async blog detail fetches) to complete
        newBlogs = await Promise.all(blogPromises);
      }
      
      if (pageNum === 1 || mode === "my") {
        setBlogs(newBlogs);
      } else {
        setBlogs((prev) => {
          // Prevent duplicate blogs
          const existingIds = new Set(prev.map(blog => blog.id));
          const uniqueNewBlogs = newBlogs.filter(blog => !existingIds.has(blog.id));
          return [...prev, ...uniqueNewBlogs];
        });
      }

      // Check if there are more pages
      if (mode === "my") {
        const currentPage = data?.meta?.current_page || 1;
        const lastPage = data?.meta?.last_page || 1;
        setHasMore(currentPage < lastPage);
      } else {
        // For new feed API, check if we got less items than per_page
        const perPage = 10;
        const currentItems = newBlogs.length;
        
        // If we got fewer items than per_page, no more pages
        if (currentItems < perPage) {
          setHasMore(false);
        } else {
          // If we got exactly per_page items, there might be more
          setHasMore(true);
        }
      }
      
      // If no data returned, also set hasMore to false
      if (newBlogs.length === 0) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError(error.message);
      setHasMore(false); // Stop trying to fetch more on error
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Reset and fetch when view mode changes
  useEffect(() => {
    setPage(1);
    setBlogs([]);
    setHasMore(true);
    setInitialLoad(true);
    setError(null);
  }, [viewMode]);

  // Initial fetch
  useEffect(() => {
    if (initialLoad) {
      getBlogs(1, viewMode);
    }
  }, [initialLoad, viewMode]);

  // Fetch when page changes (but not on initial load)
  useEffect(() => {
    if (!initialLoad && page > 1 && viewMode === "all") {
      // Only paginate for "all" mode, "my" mode might not support pagination
      getBlogs(page, viewMode);
    }
  }, [page, initialLoad, viewMode]);

  const observer = useRef(null);

  const lastBlogRef = useCallback(
    (node) => {
      if (loading) return;
      // Only enable infinite scroll for "all" mode
      if (viewMode === "my") return;
      
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading && viewMode === "all") {
            console.log('Loading next page...'); // Debug log
            setPage((prevPage) => {
              const nextPage = prevPage + 1;
              console.log(`Setting page to: ${nextPage}`); // Debug log
              return nextPage;
            });
          }
        },
        {
          threshold: 0.1, // Trigger when 10% of the element is visible
          rootMargin: '100px' // Start loading 100px before reaching the element
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, viewMode]
  );

  // Handle blog update
  const handleBlogUpdate = (updatedBlog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
    // Toast notification is already shown in EditBlogModal
  };

  // Handle blog delete
  const handleBlogDelete = async (blogId) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.delete(
        `${baseUrl}/api/v1/blogs/${blogId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.api_status === 200 || response.status === 200) {
        // Remove the blog from the list
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
        toast.success('Blog deleted successfully!');
      } else {
        throw new Error(response.data?.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to delete blog';
      toast.error(errorMsg);
    }
  };

  if (error && blogs.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading blogs: {error}</p>
        <button 
          onClick={() => {
            setError(null);
            setPage(1);
            setInitialLoad(true);
            setHasMore(true);
            getBlogs(1, viewMode);
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-[35px] bg-[#EDF6F9] flex flex-col gap-4">
      <div className="w-full sticky top-0 z-10 bg-[#EDF6F9]">
        <div className="flex items-center justify-between h-full px-4 md:px-7 flex-col md:flex-row gap-4">
          <h1 className="text-2xl font-bold text-[#212121] mb-4">Blogs</h1>
          <div className="flex gap-6 items-center">
            <Link
              to={"/blog/create"}
              className="border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5 hover:bg-gray-100 transition"
            >
              <img
                src="/icons/gridicons_create.svg"
                alt="create"
                className="size-[15px]"
              />
              <span className="text-[#808080] text-base font-medium">
                Create Blog
              </span>
            </Link>
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex gap-2 px-4 md:px-7 mt-2 mb-4">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === "all"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Blogs
          </button>
          <button
            onClick={() => setViewMode("my")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === "my"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            My Blogs
          </button>
        </div>
      </div>

      {blogs.length === 0 && !loading && !error && (
        <div className="p-6 text-center">
          <p className="text-gray-500">No blogs found.</p>
        </div>
      )}

      {blogs.map((blog, index) => {
        const isLast = index === blogs.length - 1;
        const CardComponent = viewMode === "my" ? MyBlogCard : BlogCard;
        const cardProps = viewMode === "my" 
          ? {
              blog,
              onClick: () => navigate(`/blog/${blog?.id}`),
              onUpdate: handleBlogUpdate,
              onDelete: handleBlogDelete,
            }
          : {
              blog,
              onClick: () => navigate(`/blog/${blog?.id}`),
            };

        if (isLast && viewMode === "all") {
          return (
            <div ref={lastBlogRef} key={blog.id}>
              <CardComponent {...cardProps} />
            </div>
          );
        } else {
          return (
            <CardComponent key={blog.id} {...cardProps} />
          );
        }
      })}

      {loading && (
        <div className="flex justify-center py-4">
          <Loader />
        </div>
      )}

      {error && blogs.length > 0 && (
        <div className="p-4 text-center">
          <p className="text-red-500 text-sm">Error loading more blogs: {error}</p>
          <button 
            onClick={() => {
              setError(null);
              getBlogs(page, viewMode);
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}

      {!hasMore && blogs.length > 0 && (
        <div className="p-6 text-center">
          <p className="text-gray-500">No more blogs to load.</p>
        </div>
      )}

    </div>
  );
};

export default Blog;