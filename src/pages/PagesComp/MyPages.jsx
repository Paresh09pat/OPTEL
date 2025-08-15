import React, { useEffect, useState } from 'react';
import { BiSolidEdit } from "react-icons/bi";
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/loading/Loader';

const MyPages = () => {
    const [myPages, setMyPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const myPagesData = [
        {
            id: 1,
            name: "Just Bhuvan Things",
            category: "HIP-HOP Music",
            likes: "2K+",
            comments: "100+",
            posts: "250+",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            verified: true
        },
        {
            id: 2,
            name: "Light. Lens. Laya.",
            category: "Photography",
            likes: "2K+",
            comments: "100+",
            posts: "250+",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face"
        },
        {
            id: 3,
            name: "MuscleManSid – Brains & Biceps",
            category: "Fitness Club",
            likes: "2K+",
            comments: "100+",
            posts: "250+",
            avatar: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face"
        }
    ];

    // const [myPages, setMyPages] = useState(myPagesData);

    const getMyPages = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Get access token from localStorage
            const accessToken = localStorage.getItem("access_token") || '39bceb4226d88a2749417a759ec5ec477b1bddc3e151c25e6b1c05897a01455068ff5d4f223574132d5951d1e3b31dfb7fd2dcc172df17fd';
            
            // Create form-encoded data
            const formData = new URLSearchParams();
            formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
            formData.append('limit', '10');
            formData.append('offset', '0');
            formData.append('type', 'my_pages');
            
            // SOLUTION: Remove withCredentials to avoid CORS issue
            const response = await fetch(
                `https://ouptel.com/api/get-my-pages?access_token=${accessToken}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    // DON'T include credentials - this causes the CORS error
                    // credentials: 'include', // REMOVE THIS LINE
                    body: formData.toString()
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // console.log('API Response:', data);
            
            // Transform API data to match component structure
            if (data && data.api_status === 200 && data.data) {
                const transformedData = data.data.map(page => ({
                    id: page.page_id,
                    name: page.page_name || page.name,
                    category: page.category,
                    likes: page.likes || "0",
                    comments: "0", // Not in API response
                    posts: page.users_post || "0",
                    avatar: page.avatar,
                    verified: page.verified === "1",
                    pageTitle: page.page_title,
                    description: page.page_description,
                    url: page.url,
                    isPageOwner: page.is_page_onwer
                }));
                setMyPages(transformedData);
            } else {
                console.log('Using fallback data - unexpected API response structure');
                setMyPages(fallbackData);
            }
        } catch (error) {
            console.error("Error fetching pages:", error);
            setError(error.message);
            
            // Use fallback data in case of error
            setMyPages(fallbackData);
        } finally {
            setLoading(false);
        }
    };

    // Alternative approach using proxy (for development)
    const getMyPagesWithProxy = async () => {
        // If you're still getting CORS errors, you can:
        // 1. Set up a proxy in your vite.config.js:
        /*
        export default {
            server: {
                proxy: {
                    '/api': {
                        target: 'https://ouptel.com',
                        changeOrigin: true,
                        secure: false,
                    }
                }
            }
        }
        */
        // 2. Then call: fetch('/api/get-my-pages?access_token=...')
        
        console.log('Using proxy approach - configure vite.config.js first');
    };

    useEffect(() => {
        getMyPages();
    }, []);

    // console.log("pagesData", myPages)
    if (loading) {
        return (
            
        <Loader />
            
        );
    }

    return (
        <div className="space-y-6">
            {myPages?.map((page) => (
                <div key={page.id} className="bg-white rounded-lg border border-[#808080] p-4 sm:p-6">
                    {/* Top Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={page.avatar}
                                alt={page.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                            />
                            <div>
                                <div className="flex items-center flex-wrap gap-2">
                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                                        {page.name}
                                    </h3>
                                    {/* {page.verified && (
                                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-xs">✓</span>
                                        </div>
                                    )} */}
                                </div>
                                {/* Show category below name on mobile */}
                                <p className="text-sm text-gray-600 mt-1 block sm:hidden">
                                    Category: <span className="font-bold">{page.category}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end w-full sm:w-auto gap-2">
                            {/* On mobile: category above button */}
                            <p className="text-sm text-gray-600 font-medium sm:hidden">
                                {/* Already shown inside image section */}
                            </p>
                            <Link to="/pagescomp/mainpages/pagesetting/mainpagesetting" >
                                <button className="cursor-pointer w-full sm:w-auto px-4 py-2 border border-[#808080] rounded-full text-[#808080] hover:bg-gray-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    <BiSolidEdit className="text-lg" />
                                    <span>Edit Page</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm text-gray-600">
                        {/* Desktop: category stays here */}
                        <p className="hidden sm:block">
                            Category: <span className="font-bold">{page.category}</span>
                        </p>
                        <div className="flex flex-wrap gap-4 font-semibold">
                            <span>{page.likes} Likes</span>
                            <span>{page.comments} Comments</span>
                            <span>{page.posts} Posts</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyPages;
