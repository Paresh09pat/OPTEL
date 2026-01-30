import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../Avatar';

/**
 * ReactionDetailsModal - Shows users who reacted to a post
 * 
 * Props:
 * - isOpen: boolean - controls modal visibility
 * - onClose: function - callback to close modal
 * - data: object - contains:
 *   - liked_users: array of user objects with fields:
 *     - user_id or id: user identifier
 *     - name: user's full name
 *     - username: user's username
 *     - email: user's email
 *     - avatar_url or avatar or profile_picture: user's avatar image
 *     - verified: boolean - if user is verified
 *     - reaction_type: number (1-6) - type of reaction (optional, for filtering by tabs)
 *   - reaction_counts: object - count of each reaction type
 *   - total_reactions: number - total count of all reactions
 * - isLoading: boolean - shows loading state
 * 
 * Features:
 * - Displays all users who reacted to a post
 * - Tabs to filter by reaction type (All, Like, Love, Haha, Wow, Sad, Angry)
 * - Clickable user cards that navigate to user profiles
 * - Shows verified badge for verified users
 * - Handles missing data gracefully with fallback displays
 */
const ReactionDetailsModal = ({ isOpen, onClose, data, isLoading }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    if (!isOpen) return null;

    const reactionsMapping = {
        1: { emoji: '👍', name: 'Like', color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        2: { emoji: '❤️', name: 'Love', color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-600' },
        3: { emoji: '😂', name: 'Haha', color: 'bg-yellow-400', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
        4: { emoji: '😮', name: 'Wow', color: 'bg-yellow-500', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
        5: { emoji: '😢', name: 'Sad', color: 'bg-blue-400', bgColor: 'bg-blue-50', textColor: 'text-blue-500' },
        6: { emoji: '😡', name: 'Angry', color: 'bg-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-700' }
    };

    const reactionCounts = data?.reaction_counts || {};
    const totalReactions = data?.total_reactions || 0;
    const likedUsers = data?.liked_users || [];

    // Debug log to see the data structure
    console.log('=== ReactionDetailsModal Debug ===');
    console.log('Full data:', data);
    console.log('Liked users array:', likedUsers);
    console.log('Total reactions:', totalReactions);
    console.log('Reaction counts:', reactionCounts);
    
    // Log first user to see structure
    if (likedUsers.length > 0) {
        console.log('First user structure:', likedUsers[0]);
        console.log('Available fields:', Object.keys(likedUsers[0]));
    }
    console.log('==================================');

    return (
        <div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Reactions</h2>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">
                                Total interaction: <span className="text-gray-900 font-bold">{totalReactions}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="group p-2.5 rounded-2xl bg-gray-50 hover:bg-red-50 transition-all duration-300"
                            aria-label="Close modal"
                        >
                            <FaTimes className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-hover:rotate-90 transition-all duration-300" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 px-6">
                    <div className="flex space-x-1 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                                activeTab === 'all'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            All {totalReactions > 0 && `(${totalReactions})`}
                        </button>
                        {Object.entries(reactionsMapping).map(([type, info]) => {
                            const count = reactionCounts[type] || 0;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={type}
                                    onClick={() => setActiveTab(type)}
                                    className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-1 ${
                                        activeTab === type
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    <span className="text-lg">{info.emoji}</span>
                                    <span>{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-gray-500 font-bold mt-6 tracking-wide uppercase text-xs">Loading...</p>
                        </div>
                    ) : likedUsers && likedUsers.length > 0 ? (
                        <div className="space-y-2">
                            {(activeTab === 'all' 
                                ? likedUsers 
                                : likedUsers.filter((user) => user.reaction_type === parseInt(activeTab))
                            ).map((user, index) => {
                                // Extract user ID - handle both user_id and id fields
                                const userId = user.user_id || user.id;
                                const userName = user.name || user.username || 'Unknown User';
                                const userAvatar = user.avatar_url || user.avatar || user.profile_picture;
                                const userUsername = user.username || '';
                                const userEmail = user.email || '';
                                
                                return (
                                    <div
                                        key={userId || index}
                                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group"
                                        onClick={() => {
                                            if (userId) {
                                                navigate(`/profile/${userId}`);
                                                onClose();
                                            }
                                        }}
                                    >
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                src={userAvatar}
                                                name={userName}
                                                alt={userName}
                                                size="md"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {userName}
                                                </h4>
                                                {user.verified && (
                                                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {userUsername ? `@${userUsername}` : userEmail}
                                            </p>
                                        </div>
                                        {activeTab !== 'all' && user.reaction_type && (
                                            <span className="text-2xl flex-shrink-0">
                                                {reactionsMapping[user.reaction_type]?.emoji}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                            {activeTab !== 'all' && likedUsers.filter((user) => user.reaction_type === parseInt(activeTab)).length === 0 && (
                                <div className="text-center py-12 px-6">
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl">{reactionsMapping[activeTab]?.emoji}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No {reactionsMapping[activeTab]?.name} reactions yet</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        Be the first to react with {reactionsMapping[activeTab]?.emoji}!
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : totalReactions > 0 ? (
                        <div className="text-center py-12 px-6">
                            <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">👥</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{totalReactions} Reactions</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                User details are not available for this post.
                            </p>
                            <div className="space-y-2">
                                {Object.entries(reactionsMapping).map(([type, info]) => {
                                    const count = reactionCounts[type] || 0;
                                    if (count === 0) return null;
                                    return (
                                        <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl">{info.emoji}</span>
                                                <span className="font-medium text-gray-700">{info.name}</span>
                                            </div>
                                            <span className="font-bold text-gray-900">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 px-6">
                            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                                <span className="text-4xl">✨</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No reactions yet</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Be the first to react to this post!
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50/50 flex justify-center">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 hover:shadow-lg transform active:scale-95 transition-all duration-300"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReactionDetailsModal;
