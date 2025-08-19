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
      const userId = localStorage.getItem("user_id") ;
      
      const formData = new URLSearchParams();
      formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
      // formData.append('type', 'get');
      formData.append('s', session);
      formData.append('user_id', userId);
      
      const response = await fetch(`https://ouptel.com/app_api.php?application=phone&type=get_blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest',
        },  
        body: formData.toString(),
      })
      const data = await response.json();
      // console.log(data , "blogs");
      setBlogs(data);
      console.log("🚀 ~ getBlogs ~ data:", data)
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

 if(loading) {
  return <Loader />
 }
  return (
    <div className="p-6 flex flex-col gap-4">
      {blogs?.blogs?.map((blog) => (
          <BlogCard key={blog?.id} blog={blog} onClick={() => navigate(`/blog/${blog?.id}`)} />
      ))}
    </div>
  )
}

export default Blog 