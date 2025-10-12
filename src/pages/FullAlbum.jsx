import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Share, Bookmark, Send, Smile, MoreHorizontal, Pin } from 'lucide-react';

const FullAlbumView = () => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState('');
    const albumData = useLocation()?.state?.albumData;
    const albumTitle = useLocation()?.state?.albumTitle;
    const timeStamp = useLocation()?.state?.timeStamp;
    console.log(albumData)
    const navigate = useNavigate();

    console.log(albumData);
    const handleLike = () => {
        setLiked(!liked);
    };

    const handleSave = () => {
        setSaved(!saved);
    };

    const handleComment = () => {
        if (comment.trim()) {
            // Handle comment submission here
            console.log('Comment submitted:', comment);
            setComment('');
        }
    };

    return (

        <div className="bg-[#EDF6F9] w-full h-auto  flex flex-col gap-4 ">
            <div className='w-full h-[98px] sticky pt-8 top-0 z-10 bg-[#EDF6F9]'>
                <div className="flex flex-row items-center justify-between h-full px-4 md:px-7 md:flex-row gap-4">
                    <h1 className="text-2xl font-bold text-[#212121] mb-4">My Albums</h1>
                    <div className="flex gap-6 items-center">
                        <Link to={"/my-albums/create"} className='border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5'>
                            <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
                            <span className='text-[#808080] text-base font-medium'>Create Album</span>
                        </Link>
                    </div>
                </div>
            </div>




            {/* Images Grid */}
            <div className="px-4 py-4 w-full bg-white border border-[#d3d1d1] rounded-lg">

                {/* User Info Header */}
                <div className="bg-white border-b border-[#d3d1d1] px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start md:items-center gap-3 w-1/2 md:w-full flex-col md:flex-row">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                                    <img
                                        src="/api/placeholder/40/40"
                                        alt="User avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="font-semibold text-gray-900">_amu_456</div>
                            </div>

                            <div className="flex items-center gap-2 w-full">
                                <span className="text-sm text-gray-500">added new photos to {albumTitle || 'Album No 1'}</span>
                            </div>

                        </div>
                        <div className="flex items-center gap-4 w-[30%] md:w-full justify-between flex-col md:flex-row">
                            <div className="flex items-center justify-center gap-4 w-full">
                                <span className="text-sm text-black">{albumData?.length || '50'} Photos</span>
                                <span className="text-sm text-gray-500">{timeStamp || '3 Days Ago'}</span>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-full border border-[#d3d1d1]">
                                <MoreHorizontal className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-2 gap-3 w-full mx-auto pt-4">
                    {albumData?.map((image, index) => (
                        <div key={index} className="aspect-square">
                            <img
                                src={image}
                                alt={`Album image ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                    e.target.src = "/icons/album.png"; // Fallback image
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Interaction Bar */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 mt-6">
                <div className="max-w-5xl mx-auto">
                    {/* Stats */}
                    <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                        <span>{albumData?.likes || '2K'}+ Likes</span>
                        <span>{albumData?.comments || '100'}+ Comments</span>
                        <span>{albumData?.shares || '250'}+ Shares</span>
                        <span className="ml-auto">{albumData?.saves || '50'}+ Saves</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${liked
                                ? 'text-red-500 bg-red-50'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />

                        </button>

                        <button className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100">
                            <MessageCircle className="w-5 h-5" />

                        </button>

                        <button className="flex items-center gap-2 px-3 py-2 rounded-full text-gray-600 hover:bg-gray-100">
                            <Share className="w-5 h-5" />

                        </button>

                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ml-auto ${saved
                                ? 'text-blue-500 bg-blue-50'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                            <span className="text-sm">Save</span>
                        </button>
                    </div>

                    {/* Comment Input */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                            <input
                                type="text"
                                placeholder="Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                            />
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <button className="text-gray-400 hover:text-gray-600">
                                <Pin className="w-5 h-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                                <Smile className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleComment}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FullAlbumView;