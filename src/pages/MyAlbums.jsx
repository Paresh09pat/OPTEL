import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Plus, Heart, MessageCircle, Share, Bookmark, Send, Smile } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FullAlbumView from './FullAlbum';
import { baseUrl } from '../utils/constant';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';

const MyAlbums = () => {
    const [currentView, setCurrentView] = useState('albums'); // 'albums' or 'fullAlbum'
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [perPage, setPerPage] = useState(10);
    const [noData, setNoData] = useState(false);
    // Fetch albums from API
    const fetchAlbums = async () => {
        try {
            setLoading(true);
            const accessToken = localStorage.getItem("access_token");
            const userId = localStorage.getItem("user_id");

            if (!accessToken || !userId) {
                toast.error("Please login to view albums");
                return;
            }



            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/albums?per_page=${perPage}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + accessToken,
                        "Content-Type": "application/json",
                    },
                    
                }
            );

            const data = await response.json();
          
            if (data.data && data.data.length === 0) {
                setNoData(true);
            }
            if (data.data && data.data.length > 0) {
                setAlbums(data.data || []);
            } else {
                setNoData(true);
            }
        } catch (error) {
            console.error("Error fetching albums:", error);
            toast.error("Error fetching albums. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

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
        <>
            {loading && <Loader />}
            <div className="bg-[#EDF6F9] w-full h-auto  flex flex-col gap-4">
                <div className='w-full h-[98px] sticky pt-8 top-0 z-10 bg-[#EDF6F9]'>
                    <div className="flex items-center justify-between h-full px-4 md:px-7 flex-col md:flex-row gap-4">
                        <h1 className="text-2xl font-bold text-[#212121] mb-4">My Albums</h1>
                        <div className="flex gap-6 items-center">
                            <Link to={"/my-albums/create"} className='border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5'>
                                <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
                                <span className='text-[#808080] text-base font-medium'>Create Album</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {noData && !loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 w-full mx-auto border border-[#d3d1d1] text-center">
                        <p className="text-gray-500 text-lg">No albums found. Create your first album!</p>
                    </div>
                ) : (
                    albums.map((album, index) => (
                        <ImageGallery
                            key={album.id}
                            album={album}
                            onViewMore={handleViewFullAlbum}
                        />
                    ))
                )}
            </div>
        </>
    );
};

const ImageGallery = ({
    album,
    onViewMore
}) => {
    const navigate = useNavigate();
    
    // Extract images - using cover_image as primary image for new format
    const images = album.cover_image ? [album.cover_image] : [];
    const albumTitle = album.album_name || "Untitled Album";
    const timeStamp = album.created_at || "Unknown time";
    const imageCount = images.length;

    const handleMoreClick = () => {
        navigate(`/my-albums/${album.id}`, { 
            state: { 
                albumData: images, 
                albumTitle: albumTitle, 
                timeStamp: timeStamp,
                album: album,
                user: album.user
            } 
        });
    };

    // Dynamic grid layout based on image count
    const getGridLayout = () => {
        if (imageCount === 0) return null;
        if (imageCount === 1) return "single";
        if (imageCount === 2) return "double";
        if (imageCount === 3) return "triple";
        if (imageCount === 4) return "quad";
        if (imageCount === 5) return "quint";
        return "grid"; // 6+ images
    };

    const renderSingleImage = () => (
        <div className="w-full h-96 overflow-hidden rounded-lg">
            <img
                src={images[0]}
                alt="Album image"
                className="w-full h-full object-cover"
            />
        </div>
    );

    const renderDoubleImages = () => (
        <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
                <div key={index} className="h-80 overflow-hidden rounded-lg">
                    <img
                        src={image}
                        alt={`Album image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );

    const renderTripleImages = () => (
        <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
                <div key={index} className="h-64 overflow-hidden rounded-lg">
                    <img
                        src={image}
                        alt={`Album image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );

    const renderQuadImages = () => (
        <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
                <div key={index} className="h-64 overflow-hidden rounded-lg">
                    <img
                        src={image}
                        alt={`Album image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );

    const renderQuintImages = () => (
        <div className="grid gap-2 grid-cols-3">
            {/* Main large image */}
            <div className="row-span-2 col-span-2 h-80 overflow-hidden rounded-lg">
                <img
                    src={images[0]}
                    alt="Main image"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Side images */}
            {images.slice(1).map((image, index) => (
                <div key={index} className="h-40 overflow-hidden rounded-lg">
                    <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );

    const renderGridImages = () => {
        const maxVisibleImages = 6;
        const visibleImages = images.slice(0, maxVisibleImages);
        const remainingCount = imageCount - maxVisibleImages;

        return (
            <div className="grid gap-2 grid-cols-3">
                {/* Main large image */}
                <div className="row-span-2 col-span-2 h-80 overflow-hidden rounded-lg">
                    <img
                        src={images[0]}
                        alt="Main image"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Grid images */}
                {visibleImages.slice(1, 5).map((image, index) => (
                    <div key={index} className="h-40 overflow-hidden rounded-lg">
                        <img
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
                {/* Last image with overlay for remaining count */}
                {visibleImages.length > 5 && (
                    <div className="relative h-40 overflow-hidden rounded-lg">
                        <img
                            src={visibleImages[5]}
                            alt="Gallery image"
                            className="w-full h-full object-cover"
                        />
                        {remainingCount > 0 && (
                            <div
                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-60 transition-all"
                                onClick={handleMoreClick}
                            >
                                <div className="text-white text-center">
                                    <Plus className="w-6 h-6 mx-auto mb-1" />
                                    <span className="text-base font-semibold">+{remainingCount}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderImages = () => {
        const layout = getGridLayout();
        
        switch (layout) {
            case "single":
                return renderSingleImage();
            case "double":
                return renderDoubleImages();
            case "triple":
                return renderTripleImages();
            case "quad":
                return renderQuadImages();
            case "quint":
                return renderQuintImages();
            case "grid":
                return renderGridImages();
            default:
                return (
                    <div className="text-center py-8 text-gray-500">
                        <p>No images in this album</p>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 w-full mx-auto border border-[#d3d1d1]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 gap-4 border-b border-[#d3d1d1] pb-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-[20px] font-semibold text-gray-900 pl-4">{albumTitle}</h2>
                </div>
                {/* <div className="flex items-center gap-2 w-[35%] md:wfull justify-between ">
                    <div className='flex items-center gap-4'>
                        <span className="text-sm text-black">{imageCount}+   Photos</span>
                        <span className="text-sm text-gray-500">{timeStamp}</span>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full border border-[#808080]">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                </div> */}
            </div>

            {/* Dynamic Image Layout */}
            {renderImages()}
        </div>
    );
};

export default MyAlbums