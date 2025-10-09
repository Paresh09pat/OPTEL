import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import Loader from '../../components/loading/Loader';
import { baseUrl } from '../../utils/constant';

const LikedPages = () => {
    const [likedPages, setLikedPages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    // Function to get category name by ID
    const getCategoryNameById = (categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown Category';
    };

    // Function to fetch categories
    const getCategories = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/v1/pages/meta`);
            if (res.data.ok === true) {
                setCategories(res.data?.data?.categories);
            }
        } catch (error) {
            console.log('Error fetching categories:', error);
        }
    };

    const handleUnlike = async (pageId) => {
        try {
            // Simulated API call - replace with real API call
            console.log('Unlike page:', pageId);
            // You can implement the actual unlike API call here
        } catch (error) {
            console.error('Error unliking page:', error);
        }
    };
  
    const getLikedPages = async () => {
      console.log("Fetching liked pages...");
  
      try {
        setLoading(true);
        setError(null);
  
        const accessToken = localStorage.getItem("access_token");
        const userId = localStorage.getItem("user_id");
  
        if (!accessToken || !userId) {
          throw new Error("Missing access token or user ID");
        }
  
        const formData = new URLSearchParams();
        formData.append(
          "server_key",
          "24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179"
        );
        formData.append("user_id", userId);
        formData.append("limit", "1");
        formData.append("offset", "2");
        formData.append("type", "liked_pages");
  
        const response = await fetch(
          `https://ouptel.com/api/get-my-pages?access_token=${accessToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "X-Requested-With": "XMLHttpRequest",
            },
            body: formData.toString(),
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        
        // Transform the data to include category names and keep original ID
        const transformedData = data?.data?.map(page => ({
            ...page,
            category: getCategoryNameById(page.category),
            categoryId: page.category // Keep the original ID for reference
        })) || [];
        
        setLikedPages(transformedData);
        console.log(data, "full API response");
        console.log(transformedData, "liked pages list");
      } catch (err) {
        console.error("Error fetching liked pages:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        await getCategories();
        await getLikedPages();
      };
      fetchData();
    }, []);

    // Re-process pages when categories are loaded
    useEffect(() => {
        if (categories.length > 0 && likedPages.length > 0) {
            const updatedPages = likedPages.map(page => ({
                ...page,
                category: getCategoryNameById(page.categoryId || page.category)
            }));
            setLikedPages(updatedPages);
        }
    }, [categories]);
  
    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            {likedPages?.map((page) => (
                likedPages.has(page.id) && (
                    <div key={page.id} className="bg-white rounded-lg border border-gray-300 p-4 sm:p-6">
                        {/* Top Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img
                                    src={page.avatar}
                                    alt={page.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                                        {page.name}
                                    </h3>
                                    {/* Category on mobile */}
                                    <p className="text-sm text-gray-600 mt-1 block sm:hidden">
                                        Category: <span className="font-bold">{page.category}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start sm:items-end w-full sm:w-auto gap-2">
                                <button
                                    onClick={() => handleUnlike(page.id)}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-4 py-2  text-red-500 rounded-full flex items-center justify-center gap-2 border border-red-500 text-sm sm:text-base hover:bg-[#f8f3f3] transition"
                                >
                                    <FaHeart className="text-red-500" />
                                    <span>Liked Page</span>
                                </button>
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm text-gray-600">
                            <p className="text-sm text-gray-600 font-medium hidden sm:block">
                                Category: <span className="font-bold">{page.category}</span>
                            </p>
                            <div className="flex flex-wrap gap-4 font-semibold">
                                <span>{page.likes} Likes</span>
                                <span>{page.comments} Comments</span>
                                <span>{page.posts} Posts</span>
                            </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    );
};

export default LikedPages;
