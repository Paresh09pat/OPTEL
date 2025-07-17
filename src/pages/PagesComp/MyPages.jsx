import React from 'react';
import { BiSolidEdit } from "react-icons/bi";

const MyPages = () => {
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

    return (
        <div className="space-y-6">
            {myPagesData.map((page) => (
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
                            <button className="w-full sm:w-auto px-4 py-2 border border-[#808080] rounded-full text-[#808080] hover:bg-gray-50 flex items-center justify-center gap-2 text-sm sm:text-base">
                                <BiSolidEdit className="text-lg" />
                                <span>Edit Page</span>
                            </button>
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
