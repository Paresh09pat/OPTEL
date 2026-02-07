import React, { useEffect, useState } from 'react';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const TrendingTopics = () => {
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrendingHashtags();
  }, []);

  const fetchTrendingHashtags = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/hashtags/trending?limit=10`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data?.api_status === '200' && data?.data) {
        setTrendingHashtags(data.data);
      } else {
        // Fallback to sample data if API fails
        setTrendingHashtags([
          { hashtag: '#Technology', hashtag_name: 'Technology', posts_count: 12500 },
          { hashtag: '#Design', hashtag_name: 'Design', posts_count: 8300 },
          { hashtag: '#Business', hashtag_name: 'Business', posts_count: 6700 },
          { hashtag: '#Innovation', hashtag_name: 'Innovation', posts_count: 5400 },
        ]);
      }
    } catch (error) {
      console.error('Error fetching trending hashtags:', error);
      // Fallback to sample data on error
      setTrendingHashtags([
        { hashtag: '#Technology', hashtag_name: 'Technology', posts_count: 12500 },
        { hashtag: '#Design', hashtag_name: 'Design', posts_count: 8300 },
        { hashtag: '#Business', hashtag_name: 'Business', posts_count: 6700 },
        { hashtag: '#Innovation', hashtag_name: 'Innovation', posts_count: 5400 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatPostCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleHashtagClick = (hashtag) => {
    // Navigate to explore page with hashtag filter or search
    // You can customize this based on your routing structure
    navigate(`/explore?hashtag=${encodeURIComponent(hashtag.hashtag_name)}`);
  };

  return (
    <div className="px-6 py-2 bg-white mt-2 rounded-lg border border-[#d3d1d1]">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold text-[#212121]">Trending Topics</h5>
        
      </div>

      <div className="space-y-1 mt-5">
        {loading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading trending topics...</p>
          </div>
        ) : trendingHashtags.length > 0 ? (
          trendingHashtags.map((hashtag, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-0 cursor-pointer transition-colors will-change-transform text-[#212121] hover:text-blue-600"
              onClick={() => handleHashtagClick(hashtag)}
            >
              <FaArrowTrendUp className="flex-shrink-0" />
              <a className="font-medium flex-1 mx-2">{hashtag.hashtag}</a>
              <p className="text-sm flex-shrink-0">
                {formatPostCount(hashtag.posts_count)} posts
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No trending topics available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingTopics;
