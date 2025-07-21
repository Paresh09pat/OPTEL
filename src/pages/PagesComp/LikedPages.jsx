import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';

const LikedPages = () => {
    const likedPagesData = [
        {
            id: 2,
            name: "Light. Lens. Laya.",
            category: "Photography",
            likes: "2K+",
            comments: "100+",
            posts: "250+",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face",
            isLiked: true
        },
        {
            id: 5,
            name: "Elite Cricket Academy",
            category: "Cricket",
            likes: "2K+",
            comments: "100+",
            posts: "250+",
            avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face",
            isLiked: true
        }
    ];

    const [likedPages, setLikedPages] = useState(new Set([2, 5]));
    const [loading, setLoading] = useState(false);

    const handleUnlike = async (pageId) => {
        if (loading) return;
        setLoading(true);

        try {
            // Call your backend API to unlike the page
            await axios.post(`/api/unlike-page/${pageId}`); // adjust to your actual endpoint

            setLikedPages(prev => {
                const updated = new Set(prev);
                updated.delete(pageId);
                return updated;
            });
        } catch (error) {
            console.error("Failed to unlike the page", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {likedPagesData.map((page) => (
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
