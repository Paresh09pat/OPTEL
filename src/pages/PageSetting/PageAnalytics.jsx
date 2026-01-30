import React, { useState, useEffect } from 'react';
import { Search, ThumbsUp, Download, TrendingUp, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../../utils/constant';

const PageAnalytics = ({ pageData }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!pageData?.page_id) return;

      try {
        setLoading(true);
        const accessToken = localStorage.getItem('access_token');
        
        const response = await axios.get(
          `${baseUrl}/api/v1/pages/${pageData.page_id}/analytics`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.api_status === 200) {
          setAnalyticsData(response.data.data);
        } else {
          throw new Error('Failed to fetch analytics');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [pageData]);

  // Prepare chart data for likes
  const likesChartData = analyticsData ? [
    { name: 'Today', value: analyticsData.likes.today },
    { name: 'This Week', value: analyticsData.likes.this_week },
    { name: 'This Month', value: analyticsData.likes.this_month },
    { name: 'This Year', value: analyticsData.likes.this_year },
  ] : [];

  // Prepare chart data for posts
  const postsChartData = analyticsData ? [
    { name: 'Today', value: analyticsData.posts.today },
    { name: 'This Week', value: analyticsData.posts.this_week },
    { name: 'This Month', value: analyticsData.posts.this_month },
    { name: 'This Year', value: analyticsData.posts.this_year },
  ] : [];

  // Filter recent posts based on search
  const filteredPosts = analyticsData?.recent_posts?.filter(post =>
    post.post_text.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-3.5 px-9 border border-[#d3d1d1]">
        <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-2">
          Page Analytics
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-xl p-3.5 px-9 border border-[#d3d1d1]">
        <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-2">
          Page Analytics
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-3.5 px-9 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">
        Page Analytics
      </h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center space-x-4 border-2 border-[#1153e7] rounded-xl p-4">
          <ThumbsUp className="w-8 h-8 text-[#1153e7]" />
          <div>
            <p className="text-sm text-gray-600">Total Likes</p>
            <p className="text-2xl font-bold text-[#1153e7]">{analyticsData.likes.total.toLocaleString()}</p>
            {analyticsData.likes_growth?.month !== null && (
              <p className="text-xs text-gray-500">
                {analyticsData.likes_growth.month > 0 ? '+' : ''}{analyticsData.likes_growth.month}% this month
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4 border-2 border-[#FF0707] rounded-xl p-4">
          <FileText className="w-8 h-8 text-[#FF0707]" />
          <div>
            <p className="text-sm text-gray-600">Total Posts</p>
            <p className="text-2xl font-bold text-[#FF0707]">{analyticsData.posts.total.toLocaleString()}</p>
            {analyticsData.posts_growth?.month !== null && (
              <p className="text-xs text-gray-500">
                {analyticsData.posts_growth.month > 0 ? '+' : ''}{analyticsData.posts_growth.month}% this month
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Combined Line Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[
                { name: 'Today', Likes: analyticsData.likes.today, Posts: analyticsData.posts.today },
                { name: 'This Week', Likes: analyticsData.likes.this_week, Posts: analyticsData.posts.this_week },
                { name: 'This Month', Likes: analyticsData.likes.this_month, Posts: analyticsData.posts.this_month },
                { name: 'This Year', Likes: analyticsData.likes.this_year, Posts: analyticsData.posts.this_year },
              ]}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1153e7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1153e7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF0707" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#FF0707" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
              <Area
                type="monotone"
                dataKey="Likes"
                stroke="#1153e7"
                strokeWidth={3}
                fill="url(#colorLikes)"
                dot={{ fill: '#1153e7', strokeWidth: 2, r: 5, stroke: 'white' }}
                activeDot={{ r: 7 }}
              />
              <Area
                type="monotone"
                dataKey="Posts"
                stroke="#FF0707"
                strokeWidth={3}
                fill="url(#colorPosts)"
                dot={{ fill: '#FF0707', strokeWidth: 2, r: 5, stroke: 'white' }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#1153e7]"></div>
            <span className="text-sm text-gray-600">Likes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#FF0707]"></div>
            <span className="text-sm text-gray-600">Posts</span>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Recent Posts</h3>
          <div className="relative w-full md:w-80">
            <Search className="w-5 h-5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7] text-[#212121] placeholder-[#808080]"
            />
          </div>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div key={post.post_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <p className="text-gray-800 mb-2">{post.post_text}</p>
                <p className="text-sm text-gray-500">{post.created_at_human}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No posts found matching your search' : 'No recent posts'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAnalytics;