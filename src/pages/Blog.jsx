import React, { useCallback, useEffect, useRef, useState } from "react";
import BlogCard from "../components/BlogCard";
import Loader from "../components/loading/Loader";
import { Link, useNavigate } from "react-router-dom";

const Blog = () => {
  const [session] = useState(localStorage.getItem("session_id"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const navigate = useNavigate();

  const getBlogs = async (pageNum) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching page: ${pageNum}`); // Debug log

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/blogs?term=music&page=${pageNum}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log

      // Handle the response data
      const newBlogs = data?.data || [];
      
      if (pageNum === 1) {
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
      const currentPage = data?.meta?.current_page || pageNum;
      const lastPage = data?.meta?.last_page || 1;
      const hasMoreData = currentPage < lastPage;
      
      console.log(`Current: ${currentPage}, Last: ${lastPage}, HasMore: ${hasMoreData}`); // Debug log
      
      setHasMore(hasMoreData);
      
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

  // Initial fetch
  useEffect(() => {
    if (initialLoad) {
      getBlogs(1);
    }
  }, []);

  // Fetch when page changes (but not on initial load)
  useEffect(() => {
    if (!initialLoad && page > 1) {
      getBlogs(page);
    }
  }, [page, initialLoad]);

  const observer = useRef(null);

  const lastBlogRef = useCallback(
    (node) => {
      if (loading) return;
      
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
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
    [loading, hasMore]
  );

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
              to={"/my-albums/create"}
              className="border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5"
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
      </div>

      {blogs.length === 0 && !loading && !error && (
        <div className="p-6 text-center">
          <p className="text-gray-500">No blogs found.</p>
        </div>
      )}

      {blogs.map((blog, index) => {
        if (index === blogs.length - 1) {
          return (
            <div ref={lastBlogRef} key={blog.id}>
              <BlogCard
                blog={blog}
                onClick={() => navigate(`/blog/${blog?.id}`)}
              />
            </div>
          );
        } else {
          return (
            <BlogCard
              key={blog.id}
              blog={blog}
              onClick={() => navigate(`/blog/${blog?.id}`)}
            />
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
              getBlogs(page);
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