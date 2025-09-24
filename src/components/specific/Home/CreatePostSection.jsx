import { useState, useEffect, memo } from 'react';
import { BsImage, BsCameraVideo, BsFolder } from 'react-icons/bs';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { CiCirclePlus } from 'react-icons/ci';
import { Icon } from '@iconify/react';
import { BarChart3, MapPin, Send, Smile, X } from 'lucide-react';
import { Palette } from 'lucide-react';

const CreatePostSection = ({ fetchNewFeeds }) => {
    const [postText, setPostText] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);

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

    console.log("poll", showPoll)


    const createNewPost = async (postText, selectedFiles, pollData = null) => {
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

            // Add poll data if available
            if (pollData && pollData.showPoll) {
                formData.append('poll_question', pollData.pollQuestion);
                formData.append('poll_options', JSON.stringify(pollData.pollOptions.filter(opt => opt.trim())));
                formData.append('poll_duration', pollData.pollDuration);
                formData.append('has_poll', 'true');
            }

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
            <div className="bg-white rounded-xl border border-[#d3d1d1] px-6 py-8 shadow-sm">
                {/* Input Field */}
                <div className="relative mb-4">
                    <img
                        src="/perimg.png"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover absolute left-2 top-1/2 -translate-y-1/2"
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
            />
        </>
    );
};

export default memo(CreatePostSection);


const CreatePostPopup = ({ isOpen, onClose, createNewPost, setShowPopup, showPoll, pollQuestion, pollOptions, pollDuration, setPollQuestion, setPollOptions, setPollDuration, addPollOption, removePollOption, updatePollOption, resetPoll, setShowPoll }) => {
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
                            src="/perimg.png"
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
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