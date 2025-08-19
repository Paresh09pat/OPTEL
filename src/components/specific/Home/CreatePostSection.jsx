import { useState, useEffect, memo } from 'react';
import { BsImage, BsCameraVideo, BsFolder } from 'react-icons/bs';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { CiCirclePlus } from 'react-icons/ci';
import { Icon } from '@iconify/react';
import { BarChart3, MapPin, Send, Smile } from 'lucide-react';
import { Palette } from 'lucide-react';
import { X } from 'lucide-react';

const CreatePostSection = ({ fetchNewFeeds }) => {
    const [postText, setPostText] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleMoreClick = () => {
        setShowPopup(true);
    };

    // 👉 File selector logic
    const handleFileSelect = (type) => {
        const input = document.createElement('input');
        input.type = 'file';

        if (type === 'image') {
            input.accept = 'image/*';
            input.multiple = true;
        } else if (type === 'video') {
            input.accept = 'video/*';
        } else if (type === 'audio') {
            input.accept = 'audio/*';
        } else {
            input.accept = '*';
        }

        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            if (files.length) {
                if (type === 'image') {
                    const newFiles = files.map((file) => ({
                        name: file.name,
                        type,
                        file,
                    }));
                    setSelectedFiles((prev) => [...prev, ...newFiles]);
                } else {
                    setSelectedFiles([{ name: files[0].name, type, file: files[0] }]);
                }
            }
        };

        input.click();
    };

    // ❌ Remove file handler
    const handleRemoveFile = (indexToRemove) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    };




    const genetateId = Math.floor(10 + Math.random() * 90);

    // const createNewPost = async (postText, selectedFiles) => {
    //     try {
    //         const accessToken = localStorage.getItem("access_token");
    //         const user_id = localStorage.getItem("user_id");
    //         const formData = new URLSearchParams();
    //         formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
    //         formData.append('type', 'share_post_on_timeline');

    //         formData.append('id', '169');
    //         formData.append('postText', postText);
    //         formData.append('user_id', user_id);

    //         console.log("🚀 ~ createNewPost ~ selectedFiles:", selectedFiles[0].type)

    //         if (selectedFiles[0].type === 'image') {
    //             formData.append('postPhotos[]', selectedFiles);
    //         }

    //         const response = await fetch(`https://ouptel.com/api/new_post?access_token=${accessToken}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //                 'X-Requested-With': 'XMLHttpRequest',
    //                 "Accept": "application/json"
    //             },
    //             body: formData.toString(),
    //         })
    //         const data = await response.json();
    //         if (data.api_status === 200) {
    //             fetchNewFeeds();
    //             setPostText('');
    //             setSelectedFiles([]);
    //             setShowPopup(false);
    //         }
    //     } catch (error) {
    //         console.error('Error creating new post:', error);
    //     }
    // }


    const createNewPost = async (postText, selectedFiles) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const user_id = localStorage.getItem("user_id");

            // Use FormData instead of URLSearchParams
            const formData = new FormData();
            formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
            formData.append('type', 'share_post_on_timeline');
            formData.append('id', '169');
            formData.append('postText', postText);
            formData.append('user_id', user_id);

            // Append files correctly
            selectedFiles.forEach((fileObj) => {
                if (fileObj.file && fileObj.file.type.startsWith("image/")) {
                    formData.append("postPhotos[]", fileObj.file);
                }
            });
            selectedFiles.forEach((fileObj) => {
                if (fileObj.file && fileObj.file.type.startsWith("video/")) {
                    formData.append("postVideo", fileObj.file);
                }
            });
            selectedFiles.forEach((fileObj) => {
                if (fileObj.file && fileObj.file.type.startsWith("audio/")) {
                    formData.append("postMusic", fileObj.file);
                }
            });
            selectedFiles.forEach((fileObj) => {
                if (fileObj.file && fileObj.file.type.startsWith("file/")) {
                    formData.append("postFile", fileObj.file);
                }
            });

            const response = await fetch(`https://ouptel.com/api/new_post?access_token=${accessToken}`, {
                method: "POST",
                body: formData, // <-- no need to stringify, no headers needed
            });

            const data = await response.json();
            if (data.api_status === 200) {
                fetchNewFeeds();
                setPostText("");
                setSelectedFiles([]);
                setShowPopup(false);
            }
        } catch (error) {
            console.error("Error creating new post:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {loading && <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>}
                <div className="bg-white rounded-xl border border-[#808080] px-6 py-8 shadow-sm">
                {/* Input Field */}
                <div className="relative mb-4">
                    <img
                        src="/perimg.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover absolute left-2 top-1/2 -translate-y-1/2"
                    />

                    <input
                        type="text"
                        placeholder="Share something"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                createNewPost(postText, selectedFiles);
                            }
                        }}
                        className="w-full pl-16 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => createNewPost(postText, selectedFiles)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white"
                    >
                        <Icon
                            icon="lets-icons:send-hor-light"
                            width="35"
                            height="35"
                            style={{ color: '#212121' }}
                        />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-around px-2 pt-4 text-sm text-gray-600">
                    <button
                        onClick={() => handleFileSelect('image')}
                        className="flex flex-col items-center hover:text-green-600 cursor-pointer"
                    >
                        <BsImage className="w-5 h-5 text-green-500" />
                        <span>Image</span>
                    </button>

                    <button
                        onClick={() => handleFileSelect('video')}
                        className="flex flex-col items-center hover:text-blue-600 cursor-pointer"
                    >
                        <BsCameraVideo className="w-5 h-5 text-blue-500" />
                        <span>Video</span>
                    </button>

                    <button
                        onClick={() => handleFileSelect('file')}
                        className="flex flex-col items-center hover:text-orange-600 cursor-pointer"
                    >
                        <BsFolder className="w-5 h-5 text-orange-500" />
                        <span>File</span>
                    </button>

                    <button
                        onClick={() => console.log('Poll clicked')}
                        className="flex flex-col items-center hover:text-purple-600 cursor-pointer"
                    >
                        <BiBarChartAlt2 className="w-5 h-5 text-purple-500" />
                        <span>Poll</span>
                    </button>

                    <button
                        onClick={handleMoreClick}
                        className="flex flex-col items-center hover:text-red-600 cursor-pointer"
                    >
                        <CiCirclePlus className="w-5 h-5 text-red-500" />
                        <span>More</span>
                    </button>
                </div>

                {/* File Preview Section with ❌ Remove */}
                {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                        <strong>Selected Files:</strong>
                        {selectedFiles.map((fileObj, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-around bg-[#EDF6F9] rounded px-2 py-1 w-[50%] "
                            >
                                <div className="truncate">
                                    {fileObj.type.toUpperCase()}: {fileObj.name}
                                </div>
                                <button
                                    onClick={() => handleRemoveFile(index)}
                                    className="text-red-500 hover:text-red-700 ml-4 text-lg font-bold"
                                    title="Remove"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Post Popup */}

            <CreatePostPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                createNewPost={createNewPost}
                setShowPopup={setShowPopup}
            />
        </>
    );
};

export default memo(CreatePostSection);


const CreatePostPopup = ({ isOpen, onClose, createNewPost, setShowPopup }) => {
    const [postText, setPostText] = useState('');
    const [showSharing, setShowSharing] = useState(false);
    const [commentsEnabled, setCommentsEnabled] = useState(true);

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelect = (type) => {
        const input = document.createElement('input');
        input.type = 'file';

        if (type === 'image') {
            input.accept = 'image/*';
            input.multiple = true;
        } else if (type === 'video') {
            input.accept = 'video/*';
        } else if (type === 'audio') {
            input.accept = 'audio/*';
        } else {
            input.accept = '*';
        }

        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            if (files.length) {
                if (type === 'image') {
                    // Add all images
                    const newFiles = files.map((file) => ({
                        name: file.name,
                        type,
                        file,
                    }));
                    setSelectedFiles((prev) => [...prev, ...newFiles]);
                } else {
                    // Replace existing for video/audio/file
                    setSelectedFiles([{ name: files[0].name, type, file: files[0] }]);
                }
            }
        };

        input.click();
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };
    // Handle Escape key to close popup
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handlePost = async () => {
        console.log('Posting:', { postText, commentsEnabled, showSharing });
        setPostText('');
        await createNewPost(postText, selectedFiles);
        setShowPopup(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-2 md:px-6"
            style={{ backdropFilter: 'blur(10px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 border-b border-gray-200 gap-3">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/perimg.png"
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">Create a Post</h2>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <MapPin className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <BarChart3 className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <Smile className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={handlePost}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 md:px-6 py-2 rounded-full font-medium transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                    {/* Text Input */}
                    <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 min-h-[120px]"
                        rows="5"
                    />

                    {/* Media Options */}
                    <div className="mt-6">
                        {/* Display selected files */}
                        {selectedFiles.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex w-full sm:w-[48%] md:w-[32%] items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2"
                                    >
                                        <span className="text-gray-800 text-sm truncate w-full">{file.name}</span>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="ml-2 text-gray-600 hover:text-red-600 text-lg font-bold"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {/* Image */}
                            <button
                                className="flex items-center space-x-3 p-3 cursor-pointer"
                                onClick={() => handleFileSelect('image')}
                            >
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <BsImage className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Image</span>
                            </button>

                            {/* Video */}
                            <button
                                className="flex items-center space-x-3 p-3 cursor-pointer"
                                onClick={() => handleFileSelect('video')}
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <BsCameraVideo className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Video</span>
                            </button>

                            {/* File */}
                            <button
                                className="flex items-center space-x-3 p-3 cursor-pointer"
                                onClick={() => handleFileSelect('file')}
                            >
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <BsFolder className="w-5 h-5 text-orange-600" />
                                </div>
                                <span className="text-gray-700 font-medium">File</span>
                            </button>

                            {/* Poll */}
                            <button className="flex items-center space-x-3 p-3 cursor-pointer">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <BiBarChartAlt2 className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Poll</span>
                            </button>

                            {/* Audio */}
                            <button
                                className="flex items-center space-x-3 p-3 cursor-pointer"
                                onClick={() => handleFileSelect('audio')}
                            >
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Icon icon="mdi:music" className="w-5 h-5 text-red-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Audio</span>
                            </button>

                            {/* Feelings */}
                            <button className="flex items-center space-x-3 p-3 cursor-pointer">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Smile className="w-5 h-5 text-yellow-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Feelings</span>
                            </button>

                            {/* GIF */}
                            <button className="flex items-center space-x-3 p-3 cursor-pointer">
                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                    <Icon icon="mdi:gif" className="w-5 h-5 text-pink-600" />
                                </div>
                                <span className="text-gray-700 font-medium">GIF</span>
                            </button>

                            {/* Color */}
                            <button className="flex items-center space-x-3 p-3 cursor-pointer">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-indigo-600" />
                                </div>
                                <span className="text-gray-700 font-medium">Color</span>
                            </button>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="mt-6 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700 font-medium">Sharing</span>
                                <button
                                    onClick={() => setShowSharing(!showSharing)}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <Icon icon="mdi:chevron-down" className={`w-5 h-5 transition-transform ${showSharing ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="comments"
                                    checked={commentsEnabled}
                                    onChange={(e) => setCommentsEnabled(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label htmlFor="comments" className="text-gray-700">Turn Off Comments</label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 p-2 cursor-pointer z-10"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>

    );
};