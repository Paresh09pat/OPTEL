import React, { useEffect, useState } from 'react'
import BlogCard from '../components/BlogCard';
import Loader from '../components/loading/Loader';
import { useNavigate } from 'react-router-dom';
const Blog = () => {
  const [session, setSession] = useState(localStorage.getItem("session_id"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const getBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get access token from localStorage
      // const accessToken = localStorage.getItem("access_token") ;
      // const userId = localStorage.getItem("user_id") ;

      const formData = new URLSearchParams();
      // formData.append('term', 'music');
      // formData.append('type', 'get');
      // formData.append('s', session);
      // formData.append('user_id', userId);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/blogs?term=music`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      })
      const data = await response.json();

      setBlogs(data?.data || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
      setLoading(false);
    }
  }



  useEffect(() => {
    getBlogs();
  }, []);

  // console.log("🚀 ~ Blog ~ blogs: blogs page", blogs)

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading blogs: {error}</p>
      </div>
    )
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No blogs found.</p>
      </div>
    )
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      {blogs?.map((blog) => (
        <BlogCard key={blog?.id} blog={blog} onClick={() => navigate(`/blog/${blog?.id}`)} />
      ))}
    </div>
  )
}

export default Blog 