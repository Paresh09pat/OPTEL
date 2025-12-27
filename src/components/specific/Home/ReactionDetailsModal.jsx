import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ReactionDetailsModal = ({ isOpen, onClose, data, isLoading }) => {
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

                {/* Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-gray-500 font-bold mt-6 tracking-wide uppercase text-xs">Fetching Data</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(reactionsMapping).map(([type, info]) => {
                                const count = reactionCounts[type] || 0;
                                if (count === 0 && totalReactions > 0) return null;

                                const percentage = totalReactions > 0 ? (count / totalReactions) * 100 : 0;

                                return (
                                    <div
                                        key={type}
                                        className={`group flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all duration-300`}
                                    >
                                        <div className={`flex-shrink-0 w-14 h-14 ${info.bgColor} rounded-2xl flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm`}>
                                            {info.emoji}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="font-bold text-gray-900">{info.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-black ${info.textColor}`}>{count}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{percentage.toFixed(0)}%</span>
                                                </div>
                                            </div>

                                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${info.color} rounded-full transition-all duration-1000 ease-out`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {totalReactions === 0 && !isLoading && (
                                <div className="text-center py-12 px-6">
                                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 transform -rotate-12">
                                        <span className="text-4xl">✨</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Be the first!</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        This post hasn't received any reactions yet. Spread some love and be the first one to react!
                                    </p>
                                </div>
                            )}
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
