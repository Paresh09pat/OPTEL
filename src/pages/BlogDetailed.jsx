import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';    
import Loader from '../components/loading/Loader';
const BlogDetailed = () => {
    const { blogId } = useParams();
    console.log("🚀 ~ BlogDetailed ~ blogId:", blogId)
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const accessToken = localStorage.getItem('access_token');
    
    
        const getBlog = async () => {
            const formData = new URLSearchParams();
            formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
            // formData.append('s', session);
            formData.append('blog_id', blogId);
            const response = await fetch(`https://ouptel.com/api/get-blog-by-id?access_token=${accessToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData.toString(),
            });
            const data = await response.json();
            setBlog(data.data);
            setLoading(false);
        };
      
    

    useEffect(() => {
        getBlog();
    }, []);

    console.log("🚀 ~ BlogDetailed ~ blog:", blog)

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
    {/* Thumbnail */}
    <img
      src={blog?.thumbnail}
      alt={blog?.title}
      className="w-full h-80 object-cover rounded-2xl shadow-lg"
    />

    {/* Title */}
    <h1 className="text-3xl font-bold mt-6">{blog?.title}</h1>

    {/* Author + time */}
    <div className="flex items-center gap-3 mt-3 text-gray-600">
      <img
        src={blog?.author?.avatar}
        alt={blog?.author?.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-medium">{blog?.author?.name}</p>
        <p className="text-sm">{blog?.time_text} ago • {blog?.category_name}</p>
      </div>
    </div>

    {/* Description */}
    <p className="mt-6 text-lg text-gray-700 leading-relaxed">
      {blog?.description}
    </p>

    {/* Full content */}
    <div className="mt-4 text-gray-800 leading-relaxed whitespace-pre-line">
      {blog?.content}
    </div>

    {/* Tags */}
    {blog?.tags_array?.length > 0 && (
      <div className="mt-6 flex gap-2 flex-wrap">
        {blog.tags_array.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    )}

    {/* Stats */}
    <div className="mt-8 flex gap-6 text-gray-500 text-sm">
      <span>👀 {blog?.view} views</span>
      <span>🔄 {blog?.shared} shares</span>
      <span>❤️ {blog?.reaction?.count} likes</span>
    </div>
  </div>
  )
}

export default BlogDetailed