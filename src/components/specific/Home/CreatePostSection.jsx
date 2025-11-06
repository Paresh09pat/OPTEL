import { useState, useEffect, memo } from 'react';
import { BsImage, BsCameraVideo, BsFolder } from 'react-icons/bs';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { CiCirclePlus } from 'react-icons/ci';
import { Icon } from '@iconify/react';
import { BarChart3, MapPin, Send, Smile, X } from 'lucide-react';
import { Palette } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';


const CreatePostSection = ({ fetchNewFeeds, showNotification }) => {
    const { userData } = useUser();
    const [postText, setPostText] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Additional post features
    const [postLink, setPostLink] = useState('');
    const [postLinkTitle, setPostLinkTitle] = useState('');
    const [postLinkContent, setPostLinkContent] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [location, setLocation] = useState('');
    const [feeling, setFeeling] = useState('');
    const [selectedGif, setSelectedGif] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('');
    const [albumName, setAlbumName] = useState('');
    const [groupId, setGroupId] = useState('');
    const [postType, setPostType] = useState('text');
    const [postPrivacy, setPostPrivacy] = useState('0');

    // Poll state
    const [showPoll, setShowPoll] = useState(false);
    const [pollQuestion, setPollQuestion] = useState('');
    const [pollOptions, setPollOptions] = useState(['', '']); // Start with 2 empty options
    const [pollDuration, setPollDuration] = useState('7'); // Default 7 days

    const handleMoreClick = () => {
        setShowPopup(true);
    };

    const handlePollClick = () => {
        setShowPoll(true);
        setShowPopup(true);
    };



    const addPollOption = () => {
        if (pollOptions.length < 10) { // Limit to 10 options
            setPollOptions([...pollOptions, '']);
        }
    };

    const removePollOption = (index) => {
        if (pollOptions.length > 2) { // Keep minimum 2 options
            setPollOptions(pollOptions.filter((_, i) => i !== index));
        }
    };

    const updatePollOption = (index, value) => {
        const newOptions = [...pollOptions];
        newOptions[index] = value;
        setPollOptions(newOptions);
    };

    const resetPoll = () => {
        setPollQuestion('');
        setPollOptions(['', '']);
        setPollDuration('7');
        setShowPoll(false);
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
        setSelectedFiles((prev) => {
            const fileToRemove = prev[indexToRemove];
            // Revoke the object URL to prevent memory leaks
            if (fileToRemove && fileToRemove.file) {
                URL.revokeObjectURL(URL.createObjectURL(fileToRemove.file));
            }
            return prev.filter((_, i) => i !== indexToRemove);
        });
    };

    const genetateId = Math.floor(10 + Math.random() * 90);

    // Cleanup object URLs when component unmounts
    useEffect(() => {
        return () => {
            selectedFiles.forEach((fileObj) => {
                if (fileObj && fileObj.file) {
                    URL.revokeObjectURL(URL.createObjectURL(fileObj.file));
                }
            });
        };
    }, [selectedFiles]);

    // Function to detect post type based on content
    const detectPostType = (text, files, link, youtube, album) => {
        // If album name is provided, it's definitely an album
        if (album && album.trim()) return 'album';
        
        // If YouTube link is provided, it's a video post
        if (youtube && youtube.trim()) return 'video';
        
        // If link is provided, it's a link post
        if (link && link.trim()) return 'link';
        
        // Check files for type detection
        if (files && files.length > 0) {
            const imageFiles = files.filter(f => f.file && f.file.type.startsWith('image/'));
            const hasVideos = files.some(f => f.file && f.file.type.startsWith('video/'));
            const hasAudio = files.some(f => f.file && f.file.type.startsWith('audio/'));
            const hasOtherFiles = files.some(f => f.file && !f.file.type.startsWith('image/') && !f.file.type.startsWith('video/') && !f.file.type.startsWith('audio/'));
            
            // Multiple images = album, single image = photo
            if (imageFiles.length > 1) return 'album';
            if (imageFiles.length === 1) return 'photo';
            if (hasVideos) return 'video';
            if (hasAudio) return 'audio';
            if (hasOtherFiles) return 'file';
        }
        
        return 'text';
    };

  

    const createNewPost = async (postText, selectedFiles, pollData = null) => {
        setLoading(true);
        try {
            const accessToken = localStorage.getItem("access_token");
            const user_id = localStorage.getItem("user_id");

            // Use FormData instead of URLSearchParams
            const formData = new FormData();
            // Detect post type automatically
            const detectedPostType = detectPostType(postText, selectedFiles, postLink, youtubeLink, albumName);
            
           
          
            formData.append('postText', postText);
            formData.append('user_id', user_id);
            formData.append('postType', detectedPostType);
            formData.append('postPrivacy', postPrivacy); // 0=Public, 1=Friends, 2=Only Me, 4=Group

            // Add link if provided
            if (postLink && postLink.trim()) {
                formData.append('postLink', postLink.trim());
                if (postLinkTitle && postLinkTitle.trim()) {
                    formData.append('postLinkTitle', postLinkTitle.trim());
                }
                if (postLinkContent && postLinkContent.trim()) {
                    formData.append('postLinkContent', postLinkContent.trim());
                }
            }

            // Add YouTube link if provided
            if (youtubeLink && youtubeLink.trim()) {
                formData.append('postYoutube', youtubeLink.trim());
            }

            // Add album name if provided
            if (albumName && albumName.trim()) {
                formData.append('album_name', albumName.trim());
            }

            // Add group ID if provided
            if (groupId && groupId.trim()) {
                formData.append('group_id', groupId.trim());
            }

            // Add location if provided
            if (location && location.trim()) {
                formData.append('postLocation', location.trim());
            }

            // Add feeling if provided
            if (feeling && feeling.trim()) {
                formData.append('postFeeling', feeling.trim());
            }

            // Add background color if provided
            if (backgroundColor && backgroundColor.trim()) {
                formData.append('postBackground', backgroundColor.trim());
            }

            // Add poll data if available
            if (pollData && pollData.showPoll) {
                formData.append('poll_question', pollData.pollQuestion);
                formData.append('poll_options', JSON.stringify(pollData.pollOptions.filter(opt => opt.trim())));
                formData.append('poll_duration', pollData.pollDuration);
                formData.append('has_poll', 'true');
            }

            // Append files correctly
            console.log("Selected files count:", selectedFiles.length);
            console.log("Selected files:", selectedFiles);
            console.log("Detected post type:", detectedPostType);
            console.log("Album name:", albumName);
            
            let imageCount = 0;
            selectedFiles.forEach((fileObj, index) => {
                console.log(`File ${index}:`, fileObj);
                if (fileObj.file && fileObj.file.type.startsWith("image/")) {
                    imageCount++;
                    console.log(`Appending image file ${imageCount}:`, fileObj.file.name, fileObj.file.type);
                    
                    // For album posts, use album_images[]
                    if (detectedPostType === 'album') {
                        console.log("Using album_images[] for file:", fileObj.file.name);
                        formData.append("album_images[]", fileObj.file);
                    } else {
                        console.log("Using postPhoto for file:", fileObj.file.name);
                        // For single photo posts, use postPhoto
                        formData.append("postPhoto", fileObj.file);
                    }
                }
            });
            console.log("Total images processed:", imageCount);
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

            // Debug FormData contents
            console.log("FormData contents:");
            let albumImagesCount = 0;
            for (let [key, value] of formData.entries()) {
                if (key === 'album_images[]') {
                    albumImagesCount++;
                    console.log(`${key} (${albumImagesCount}):`, value.name || value);
                } else {
                    console.log(key, value);
                }
            }
            console.log(`Total album_images[] entries: ${albumImagesCount}`);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/posts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });


            const data = await response.data;
            console.log("Create post response:", data);
            
            if (data.ok === true) {
                // Show success message
                console.log("Post created successfully:", data.message);
                if (showNotification) {
                    showNotification(data.message || "Post created successfully!", 'success');
                }
                
                // Refresh the feed to show the new post
                fetchNewFeeds();
                
                // Reset form state
                setPostText("");
                setSelectedFiles([]);
                setShowPopup(false);
                
                // Reset additional features
                setPostLink("");
                setPostLinkTitle("");
                setPostLinkContent("");
                setYoutubeLink("");
                setLocation("");
                setFeeling("");
                setSelectedGif(null);
                setBackgroundColor("");
                setAlbumName("");
                setGroupId("");
                setPostType("text");
                setPostPrivacy("0");
                
                // Reset poll state if poll was created
                if (pollData && pollData.showPoll) {
                    resetPoll();
                }
            } else {
                console.error("Failed to create post:", data.message || "Unknown error");
                if (showNotification) {
                    showNotification(data.message || "Failed to create post", 'error');
                }
            }
        } catch (error) {
            console.error("Error creating new post:", error);
            if (showNotification) {
                showNotification("Error creating post. Please try again.", 'error');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            {loading && <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>}
            <div className="bg-white rounded-xl border border-[#d3d1d1] px-6 py-8 shadow-sm">
                {/* Input Field */}
                <div className="relative mb-4">
                    <img
                        src={userData?.avatar_url || "/perimg.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover absolute left-2 top-1/2 -translate-y-1/2"
                        onError={(e) => {
                            e.target.src = "/perimg.png";
                        }}
                    />

                    <input
                        type="text"
                        placeholder={showPoll ? "Share something with a poll..." : "Share something"}
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                createNewPost(postText, selectedFiles, { showPoll, pollQuestion, pollOptions, pollDuration });
                            }
                        }}
                        className="w-full pl-16 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => createNewPost(postText, selectedFiles, { showPoll, pollQuestion, pollOptions, pollDuration })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white cursor-pointer"
                    >
                        <Icon
                            icon="lets-icons:send-hor-light"
                            width="35"
                            height="35"
                            style={{ color: '#212121' }}
                        />
                    </button>
                </div>

                {/* Poll Indicator */}
                {showPoll && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <BiBarChartAlt2 className="w-5 h-5 text-purple-600 mr-2" />
                                <span className="text-sm font-medium text-purple-800">Poll Active</span>
                            </div>
                            <button
                                onClick={resetPoll}
                                className="text-purple-600 hover:text-purple-800 text-sm underline cursor-pointer"
                            >
                                Remove Poll
                            </button>
                        </div>
                        {pollQuestion && (
                            <p className="text-sm text-gray-700 mt-2">
                                <strong>Q:</strong> {pollQuestion}
                            </p>
                        )}
                    </div>
                )}

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
                        onClick={() => {
                            console.log('Poll button clicked in main section, current showPoll:', showPoll);
                            handlePollClick();
                        }}
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
                    <div className="mt-4 space-y-3 text-sm text-gray-700">
                        <strong>Selected Files:</strong>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {selectedFiles.map((fileObj, index) => (
                                <div
                                    key={index}
                                    className="bg-[#EDF6F9] rounded-lg p-3 border border-gray-200"
                                >
                                    {/* Image Preview */}
                                    {fileObj.type === 'image' && fileObj.file && (
                                        <div className="mb-2">
                                            <img
                                                src={URL.createObjectURL(fileObj.file)}
                                                alt={fileObj.name}
                                                className="w-full h-32 object-cover rounded-md border border-gray-300"
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Video Preview */}
                                    {fileObj.type === 'video' && fileObj.file && (
                                        <div className="mb-2">
                                            <video
                                                src={URL.createObjectURL(fileObj.file)}
                                                className="w-full h-32 object-cover rounded-md border border-gray-300"
                                                controls={false}
                                                muted
                                            />
                                        </div>
                                    )}
                                    
                                    {/* File Info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                    {fileObj.type.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="truncate text-sm font-medium text-gray-800">
                                                {fileObj.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>
                                        
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveFile(index)}
                                            className="ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                            title="Remove"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Post Popup */}

            <CreatePostPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                createNewPost={createNewPost}
                setShowPopup={setShowPopup}
                showPoll={showPoll}
                pollQuestion={pollQuestion}
                pollOptions={pollOptions}
                pollDuration={pollDuration}
                setPollQuestion={setPollQuestion}
                setPollOptions={setPollOptions}
                setPollDuration={setPollDuration}
                addPollOption={addPollOption}
                removePollOption={removePollOption}
                updatePollOption={updatePollOption}
                resetPoll={resetPoll}
                setShowPoll={setShowPoll}
                // Additional features
                postLink={postLink}
                setPostLink={setPostLink}
                postLinkTitle={postLinkTitle}
                setPostLinkTitle={setPostLinkTitle}
                postLinkContent={postLinkContent}
                setPostLinkContent={setPostLinkContent}
                youtubeLink={youtubeLink}
                setYoutubeLink={setYoutubeLink}
                location={location}
                setLocation={setLocation}
                feeling={feeling}
                setFeeling={setFeeling}
                selectedGif={selectedGif}
                setSelectedGif={setSelectedGif}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                albumName={albumName}
                setAlbumName={setAlbumName}
                groupId={groupId}
                setGroupId={setGroupId}
                postType={postType}
                setPostType={setPostType}
                postPrivacy={postPrivacy}
                setPostPrivacy={setPostPrivacy}
            />
        </>
    );
};

export default memo(CreatePostSection);


const CreatePostPopup = ({ 
    isOpen, onClose, createNewPost, setShowPopup, 
    showPoll, pollQuestion, pollOptions, pollDuration, 
    setPollQuestion, setPollOptions, setPollDuration, 
    addPollOption, removePollOption, updatePollOption, resetPoll, setShowPoll,
    // Additional features
    postLink, setPostLink, postLinkTitle, setPostLinkTitle, postLinkContent, setPostLinkContent,
    youtubeLink, setYoutubeLink, location, setLocation, feeling, setFeeling, 
    selectedGif, setSelectedGif, backgroundColor, setBackgroundColor,
    albumName, setAlbumName, groupId, setGroupId, postType, setPostType, postPrivacy, setPostPrivacy
}) => {
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
            console.log("Popup file selection - type:", type, "files:", files);
            if (files.length) {
                if (type === 'image') {
                    // Add all images
                    const newFiles = files.map((file) => ({
                        name: file.name,
                        type,
                        file,
                    }));
                    console.log("Popup adding image files:", newFiles);
                    setSelectedFiles((prev) => {
                        const updated = [...prev, ...newFiles];
                        console.log("Popup selectedFiles updated:", updated);
                        return updated;
                    });
                } else {
                    // Replace existing for video/audio/file
                    const newFile = { name: files[0].name, type, file: files[0] };
                    console.log("Popup replacing with file:", newFile);
                    setSelectedFiles([newFile]);
                }
            }
        };

        input.click();
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => {
            const fileToRemove = prev[index];
            // Revoke the object URL to prevent memory leaks
            if (fileToRemove && fileToRemove.file) {
                URL.revokeObjectURL(URL.createObjectURL(fileToRemove.file));
            }
            return prev.filter((_, i) => i !== index);
        });
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
        console.log('Posting:', { postText, commentsEnabled, showSharing, showPoll, pollQuestion, pollOptions, pollDuration });

        // Validate poll if it's enabled
        if (showPoll) {
            if (!pollQuestion.trim()) {
                alert('Please enter a poll question');
                return;
            }
            if (!pollOptions.some(opt => opt.trim())) {
                alert('Please enter at least one poll option');
                return;
            }
        }

        console.log("Popup selectedFiles before createNewPost:", selectedFiles);
        console.log("Popup postText:", postText);
        console.log("Popup albumName:", albumName);
        
        setPostText('');
        await createNewPost(postText, selectedFiles, { showPoll, pollQuestion, pollOptions, pollDuration });
        setShowPopup(false);

        // Reset poll if it was created
        if (showPoll) {
            resetPoll();
        }
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
                            src={localStorage.getItem('user_avatar_url') || "/perimg.png"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = "/perimg.png";
                            }}
                        />
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl font-semibold text-gray-800">Create a Post</h2>
                            {showPoll && (
                                <div className="flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                    <BiBarChartAlt2 className="w-3 h-3 mr-1" />
                                    Poll ({pollOptions.filter(opt => opt.trim()).length} options)
                                </div>
                            )}
                        </div>
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
                        placeholder={showPoll ? "What's on your mind? (Poll will be included)" : "What's on your mind?"}
                        className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 min-h-[120px]"
                        rows="5"
                    />

                    {/* Poll Creation Section */}
                    {showPoll && (
                        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200 relative animate-in slide-in-from-top-2 duration-300">
                            {/* Close button for poll section */}
                            <button
                                onClick={resetPoll}
                                className="absolute top-2 right-2 p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-full transition-colors"
                                title="Close poll"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-purple-800">Create Poll</h3>
                            </div>

                            {/* Poll Question */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Poll Question *
                                </label>
                                <input
                                    type="text"
                                    value={pollQuestion}
                                    onChange={(e) => setPollQuestion(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    maxLength={200}
                                />
                            </div>

                            {/* Poll Options */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Poll Options *
                                </label>
                                {pollOptions.map((option, index) => (
                                    <div key={index} className="flex items-center mb-2 animate-in slide-in-from-left-2 duration-200">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updatePollOption(index, e.target.value)}
                                            placeholder={`Option ${index + 1}`}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            maxLength={100}
                                        />
                                        {pollOptions.length > 2 && (
                                            <button
                                                onClick={() => removePollOption(index)}
                                                className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full cursor-pointer"
                                                title="Remove option"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Add Option Button */}
                                {pollOptions.length < 10 && (
                                    <button
                                        onClick={addPollOption}
                                        className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium mt-2"
                                    >
                                        <CiCirclePlus className="w-4 h-4 mr-1" />
                                        Add Option
                                    </button>
                                )}
                            </div>

                            {/* Poll Duration */}
                            {/* <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Poll Duration
                                </label>
                                <select
                                    value={pollDuration}
                                    onChange={(e) => setPollDuration(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="1">1 day</option>
                                    <option value="3">3 days</option>
                                    <option value="7">1 week</option>
                                    <option value="14">2 weeks</option>
                                    <option value="30">1 month</option>
                                </select>
                            </div> */}

                            {/* Poll Preview */}
                            {pollQuestion && pollOptions.some(opt => opt.trim()) && (
                                <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Poll Preview:</h4>
                                    <p className="text-gray-800 font-medium mb-3">{pollQuestion}</p>
                                    <div className="space-y-2">
                                        {pollOptions.map((option, index) => (
                                            option.trim() && (
                                                <div key={index} className="flex items-center p-2 bg-gray-50 rounded border">
                                                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3"></div>
                                                    <span className="text-gray-700">{option}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Duration: {pollDuration} {pollDuration === '1' ? 'day' : pollDuration === '7' ? 'days' : pollDuration === '30' ? 'days' : 'days'}
                                    </p>
                                </div>
                                )}

                            {/* Reset Poll Button */}
                            {/* <div className="mt-4 text-center">
                                 <button
                                     onClick={resetPoll}
                                     className="text-purple-600 hover:text-purple-800 text-sm underline hover:no-underline"
                                 >
                                     Reset Poll
                                 </button>
                             </div> */}
                        </div>
                    )}

                    {/* Media Options */}
                    <div className="mt-6">
                        {/* Display selected files */}
                        {selectedFiles.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Files:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                                        >
                                            {/* Image Preview */}
                                            {file.type === 'image' && file.file && (
                                                <div className="mb-2">
                                                    <img
                                                        src={URL.createObjectURL(file.file)}
                                                        alt={file.name}
                                                        className="w-full h-24 object-cover rounded-md border border-gray-300"
                                                    />
                                                </div>
                                            )}
                                            
                                            {/* Video Preview */}
                                            {file.type === 'video' && file.file && (
                                                <div className="mb-2">
                                                    <video
                                                        src={URL.createObjectURL(file.file)}
                                                        className="w-full h-24 object-cover rounded-md border border-gray-300"
                                                        controls={false}
                                                        muted
                                                    />
                                                </div>
                                            )}
                                            
                                            {/* File Info */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                                            {file.type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="truncate text-sm font-medium text-gray-800">
                                                        {file.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                                    </div>
                                                </div>
                                                
                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFile(index)}
                                                    className="ml-2 p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Remove"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                            <button
                                className={`flex items-center space-x-3 p-3 cursor-pointer transition-all duration-200 ${showPoll ? 'bg-purple-100 rounded-lg border-2 border-purple-300' : 'hover:bg-purple-50'
                                    }`}
                                onClick={() => {
                                    console.log("showPoll", showPoll)
                                    if (showPoll) {
                                        resetPoll();
                                    } else {
                                        setShowPoll(true);
                                    }

                                }}
                                title={showPoll ? "Hide poll creation" : "Create a poll"}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${showPoll ? 'bg-purple-200' : 'bg-purple-100'
                                    }`}>
                                    <BiBarChartAlt2 className={`w-5 h-5 transition-colors ${showPoll ? 'text-purple-700' : 'text-purple-600'
                                        }`} />
                                </div>
                                <span className={`font-medium transition-colors ${showPoll ? 'text-purple-800' : 'text-gray-700'
                                    }`}>
                                    {showPoll ? 'Hide Poll' : 'Poll'}
                                </span>
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

                    {/* Additional Features */}
                    <div className="mt-6 space-y-4">
                        {/* Link Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Add Link
                            </label>
                            <input
                                type="url"
                                value={postLink}
                                onChange={(e) => setPostLink(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {postLink && (
                                <div className="mt-2 space-y-2">
                                    <input
                                        type="text"
                                        value={postLinkTitle}
                                        onChange={(e) => setPostLinkTitle(e.target.value)}
                                        placeholder="Link title (optional)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <textarea
                                        value={postLinkContent}
                                        onChange={(e) => setPostLinkContent(e.target.value)}
                                        placeholder="Link description (optional)"
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            )}
                        </div>

                        {/* YouTube Link Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                YouTube Video
                            </label>
                            <input
                                type="url"
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Location Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Where are you?"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Feeling Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Feeling/Activity
                            </label>
                            <input
                                type="text"
                                value={feeling}
                                onChange={(e) => setFeeling(e.target.value)}
                                placeholder="How are you feeling?"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Background Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Background Color
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    placeholder="#ffffff"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Album Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Album Name
                            </label>
                            <input
                                type="text"
                                value={albumName}
                                onChange={(e) => setAlbumName(e.target.value)}
                                placeholder="My Album Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Group ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Group ID
                            </label>
                            <input
                                type="number"
                                value={groupId}
                                onChange={(e) => setGroupId(e.target.value)}
                                placeholder="Group ID (for group posts)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Post Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Post Type
                            </label>
                            <select
                                value={postType}
                                onChange={(e) => setPostType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="text">Text</option>
                                <option value="photo">Photo</option>
                                <option value="video">Video</option>
                                <option value="link">Link</option>
                                <option value="file">File</option>
                                <option value="audio">Audio</option>
                                <option value="album">Album</option>
                            </select>
                        </div>

                        {/* Privacy Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Privacy
                            </label>
                            <select
                                value={postPrivacy}
                                onChange={(e) => setPostPrivacy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="0">Public</option>
                                <option value="1">Friends</option>
                                <option value="2">Only Me</option>
                                <option value="4">Group</option>
                            </select>
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
        </div >

    );
};