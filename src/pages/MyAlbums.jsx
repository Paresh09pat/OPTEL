import React, { useState } from 'react';
import { MoreHorizontal, Plus, Heart, MessageCircle, Share, Bookmark, Send, Smile } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FullAlbumView from './FullAlbum';

const images = [
    '/perimg.png',
    '/mobile.jpg',
    '/pagesCardImg.png',
    '/perimg.png',
    '/perimg.png',
    '/perimg.png',
    '/perimg.png'
];

const MyAlbums = () => {
    const [currentView, setCurrentView] = useState('albums'); // 'albums' or 'fullAlbum'
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const navigate = useNavigate();

    const handleViewFullAlbum = (albumData) => {
        setSelectedAlbum(albumData);
        setCurrentView('fullAlbum');
    };

    const handleBackToAlbums = () => {
        setCurrentView('albums');
        setSelectedAlbum(null);
    };

    if (currentView === 'fullAlbum') {
        return (
            <FullAlbumView
                albumData={selectedAlbum}
                onBack={handleBackToAlbums}
            />
        );
    }

    return (
        <div className="bg-[#EDF6F9] w-full h-auto  flex flex-col gap-4">
            <div className='w-full h-[98px] sticky pt-8 top-0 z-10 bg-[#EDF6F9]'>
                <div className="flex items-center justify-between h-full px-4 md:px-7 flex-col md:flex-row gap-4">
                    <h1 className="text-2xl font-bold text-[#212121] mb-4">My Albums</h1>
                    <div className="flex gap-6 items-center">
                        <Link to={"/my-albums/create"} className='border border-[#808080] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5'>
                            <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
                            <span className='text-[#808080] text-base font-medium'>Create Album</span>
                        </Link>
                    </div>
                </div>
            </div>

            <ImageGallery
                images={images}
                albumTitle="Album No 1"
                timeStamp="3 Days Ago"
                maxVisibleImages={5}
                onViewMore={handleViewFullAlbum}
            />

            <ImageGallery
                images={images}
                albumTitle="Album No 2"
                timeStamp="5 Days Ago"
                maxVisibleImages={5}
                onViewMore={handleViewFullAlbum}
            />
        </div>
    );
};

const ImageGallery = ({
    images = [],
    albumTitle = "Album No 1",
    timeStamp = "3 Days Ago",
    maxVisibleImages = 5,
    onViewMore
}) => {
    const visibleImages = images.slice(0, maxVisibleImages);
    const remainingCount = images.length - maxVisibleImages;
    const navigate = useNavigate();


    const handleMoreClick = () => {
        navigate(`/my-albums/${albumTitle}`, { state: { albumData: images, albumTitle: albumTitle, timeStamp: timeStamp } })
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 w-full mx-auto border border-[#808080]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 gap-4 border-b border-[#808080] pb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-[20px] font-semibold text-gray-900 pl-4">{albumTitle}</h2>
                </div>
                <div className="flex items-center gap-2 w-[35%] md:wfull justify-between ">
                    <div className='flex items-center gap-4'>
                        <span className="text-sm text-black">{images.length}+   Photos</span>
                        <span className="text-sm text-gray-500">{timeStamp}</span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full border border-[#808080]">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 overflow-hidden">
                {/* Main large image */}
                {visibleImages.length > 0 && (
                    <div className="row-span-2 col-span-2 md:col-span-2 md:row-span-2 h-64 sm:h-80 md:h-[435px] overflow-hidden">
                        <img
                            src={visibleImages[0]}
                            alt="Main image"
                            className="w-full h-full object-cover"
                            style={{ aspectRatio: '1/1.2' }}
                        />
                    </div>
                )}

                {/* Grid images */}
                {visibleImages.slice(1).map((image, index) => (
                    <div key={index} className="relative h-32 sm:h-40 md:h-[13.2em] overflow-hidden">
                        <img
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                            style={{ aspectRatio: '1/1' }}
                        />

                        {index === visibleImages.length - 2 && remainingCount > 0 && (
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all"
                                onClick={handleMoreClick}
                            >
                                <div className="text-white text-center">
                                    <Plus className="w-8 h-8 mx-auto mb-1" />
                                    <span className="text-lg font-semibold">+{remainingCount}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>


        </div>
    );
};

export default MyAlbums