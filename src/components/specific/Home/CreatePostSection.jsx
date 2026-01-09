import { useState, useEffect, memo } from 'react';
import { BsImage, BsCameraVideo, BsFolder } from 'react-icons/bs';
import { BiBarChartAlt2 } from 'react-icons/bi';
import { CiCirclePlus } from 'react-icons/ci';
import { Icon } from '@iconify/react';
import { BarChart3, MapPin, Send, Smile, X } from 'lucide-react';
import { Palette } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { toast } from 'react-toastify';


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

    // GIF search state
    const [showGifSearch, setShowGifSearch] = useState(false);
    const [gifSearchQuery, setGifSearchQuery] = useState('');
    const [gifResults, setGifResults] = useState([]);
    const [gifLoading, setGifLoading] = useState(false);
    const [gifSearchPage, setGifSearchPage] = useState(0);

    // Feeling state
    const [showFeelingModal, setShowFeelingModal] = useState(false);
    const [selectedFeeling, setSelectedFeeling] = useState(null);

    // Activities state (traveling, listening, watching, playing, reaction)
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [currentActivityType, setCurrentActivityType] = useState(null); // 'traveling', 'listening', 'watching', 'playing', 'reaction'
    const [selectedActivity, setSelectedActivity] = useState(null); // { type: 'traveling', value: 'Paris', label: 'Traveling to Paris' }

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

    // GIF search function using Giphy API
    const searchGifs = async (query = '', offset = 0) => {
        setGifLoading(true);
        try {
            // Using Giphy API - you can replace this with your own API key
            // Get a free API key from https://developers.giphy.com/
            const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || 'GlVGYHkr3WSBnllca54iNt0yFbjz7Z65'; // Demo key - replace with your own
            const limit = 20;
            
            let url;
            if (query.trim()) {
                url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&rating=g`;
            } else {
                // Trending GIFs when no query
                url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&offset=${offset}&rating=g`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.data && Array.isArray(data.data)) {
                const gifs = data.data.map(gif => ({
                    id: gif.id,
                    url: gif.images.original.url,
                    preview: gif.images.fixed_height_small.url,
                    title: gif.title
                }));

                if (offset === 0) {
                    setGifResults(gifs);
                } else {
                    setGifResults(prev => [...prev, ...gifs]);
                }
            }
        } catch (error) {
            console.error('Error searching GIFs:', error);
            toast.error('Failed to load GIFs. Please try again.');
        } finally {
            setGifLoading(false);
        }
    };

    // Handle GIF selection
    const handleGifSelect = (gif) => {
        setSelectedGif(gif);
        setShowGifSearch(false);
        setGifSearchQuery('');
        setGifResults([]);
    };

    // Load trending GIFs on mount
    useEffect(() => {
        if (showGifSearch && gifResults.length === 0) {
            searchGifs('', 0);
        }
    }, [showGifSearch]);

    // Debounced GIF search
    useEffect(() => {
        if (!showGifSearch) return;

        const timeoutId = setTimeout(() => {
            if (gifSearchQuery.trim() || gifSearchQuery === '') {
                setGifSearchPage(0);
                searchGifs(gifSearchQuery, 0);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [gifSearchQuery, showGifSearch]);

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

    // Generic function to create activity posts (feeling, traveling, listening, watching, playing, reaction)
    const createActivityPost = async (postText, activityType, activityValue) => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem("access_token");

            // Validate activity data
            if (!activityValue || !activityValue.trim()) {
                const errorMessage = `Please provide ${activityType} information.`;
                if (showNotification) {
                    showNotification(errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
                setLoading(false);
                return;
            }

            // Prepare post text - include activity label if not already in text
            let finalPostText = postText.trim() || '';
            const activityLabel = activityType === 'feeling' ? `Feeling ${activityValue}` :
                                 activityType === 'traveling' ? `Traveling to ${activityValue}` :
                                 activityType === 'listening' ? `Listening to ${activityValue}` :
                                 activityType === 'watching' ? `Watching ${activityValue}` :
                                 activityType === 'playing' ? `Playing ${activityValue}` :
                                 activityType === 'reaction' ? activityValue : '';

            // If post text is empty or doesn't include the activity, prepend it
            if (!finalPostText || !finalPostText.toLowerCase().includes(activityValue.toLowerCase())) {
                if (finalPostText) {
                    finalPostText = `${activityLabel}\n\n${finalPostText}`;
                } else {
                    finalPostText = activityLabel;
                }
            }

            // Prepare request data based on activity type
            const requestData = {
                postText: finalPostText,
                postPrivacy: postPrivacy,
            };

            // Add activity-specific field
            if (activityType === 'feeling') {
                requestData.feeling = activityValue.trim();
            } else if (activityType === 'traveling') {
                requestData.traveling = activityValue.trim();
            } else if (activityType === 'listening') {
                requestData.listening = activityValue.trim();
            } else if (activityType === 'watching') {
                requestData.watching = activityValue.trim();
            } else if (activityType === 'playing') {
                requestData.playing = activityValue.trim();
            } else if (activityType === 'reaction') {
                requestData.reaction = activityValue.trim();
            }

            console.log(`Creating ${activityType} post with data:`, requestData);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/posts?type=${activityType}`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response.data;
            console.log(`Create ${activityType} post response:`, data);

            // Check for success
            if (data.ok === true || data.api_status === 200) {
                const successMessage = `${activityType.charAt(0).toUpperCase() + activityType.slice(1)} post created successfully!`;
                if (showNotification) {
                    showNotification(successMessage, 'success');
                } else {
                    toast.success(successMessage);
                }

                // Refresh the feed to show the new post
                if (fetchNewFeeds) {
                    fetchNewFeeds();
                }

                // Reset form state
                setPostText("");
                setSelectedFiles([]);
                setShowPopup(false);
                setSelectedGif(null);
                setSelectedFeeling(null);
                setSelectedActivity(null);
                setFeeling("");
                setShowGifSearch(false);
                setShowFeelingModal(false);
                setShowActivityModal(false);
                setCurrentActivityType(null);

                // Reset additional features
                setPostLink("");
                setPostLinkTitle("");
                setPostLinkContent("");
                setYoutubeLink("");
                setLocation("");
                setBackgroundColor("");
                setAlbumName("");
                setGroupId("");
                setPostType("text");
                setPostPrivacy("0");
            } else {
                const errorMessage = data.message || `Failed to create ${activityType} post`;
                console.error(`Failed to create ${activityType} post:`, errorMessage);
                if (showNotification) {
                    showNotification(errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (error) {
            console.error(`Error creating ${activityType} post:`, error);
            const errorMessage = error.response?.data?.message || error.message || `Error creating ${activityType} post. Please try again.`;
            if (showNotification) {
                showNotification(errorMessage, 'error');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to create a feeling post using the dedicated feeling API (kept for backward compatibility)
    const createFeelingPost = async (postText, feelingValue) => {
        return createActivityPost(postText, 'feeling', feelingValue);
    };

    // Function to create a GIF post using the dedicated GIF API
    const createGifPost = async (postText, gif) => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem("access_token");

            // Validate GIF data
            if (!gif || !gif.url) {
                const errorMessage = "Please select a GIF.";
                if (showNotification) {
                    showNotification(errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
                setLoading(false);
                return;
            }

            // Prepare request data
            const requestData = {
                postText: postText.trim() || '',
                postPrivacy: postPrivacy,
                postGif: gif.url
            };

            console.log("Creating GIF post with data:", requestData);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/posts?type=gif`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response.data;
            console.log("Create GIF post response:", data);

            // Check for success
            if (data.ok === true || data.api_status === 200) {
                if (showNotification) {
                    showNotification("GIF post created successfully!", 'success');
                } else {
                    toast.success("GIF post created successfully!");
                }

                // Refresh the feed to show the new post
                if (fetchNewFeeds) {
                    fetchNewFeeds();
                }

                // Reset form state
                setPostText("");
                setSelectedFiles([]);
                setShowPopup(false);
                setSelectedGif(null);
                setShowGifSearch(false);

                // Reset additional features
                setPostLink("");
                setPostLinkTitle("");
                setPostLinkContent("");
                setYoutubeLink("");
                setLocation("");
                setFeeling("");
                setBackgroundColor("");
                setAlbumName("");
                setGroupId("");
                setPostType("text");
                setPostPrivacy("0");
            } else {
                const errorMessage = data.message || "Failed to create GIF post";
                console.error("Failed to create GIF post:", errorMessage);
                if (showNotification) {
                    showNotification(errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (error) {
            console.error("Error creating GIF post:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error creating GIF post. Please try again.";
            if (showNotification) {
                showNotification(errorMessage, 'error');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to create a poll using the dedicated poll API
    const createPoll = async (pollQuestion, pollOptions, postText = '') => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem("access_token");

            // Validate poll data
            if (!pollQuestion || !pollQuestion.trim()) {
                const errorMessage = "Please enter a poll question.";
                if (showNotification) {
                    showNotification(errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
                setLoading(false);
                return;
            }

            // Filter out empty options
            const validOptions = pollOptions.filter(opt => opt && opt.trim().length > 0);
            if (validOptions.length < 2) {
                const errorMessage = "Please provide at least 2 poll options.";
                if (showNotification) {
                    showNotification(errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
                setLoading(false);
                return;
            }

            // Use postText if provided, otherwise use pollQuestion as postText
            // The API expects postText to be the main content (poll question)
            const pollPostText = postText.trim() || pollQuestion.trim();

            // Prepare request data
            const requestData = {
                postText: pollPostText,
                postPrivacy: postPrivacy,
                answer: validOptions.map(opt => opt.trim())
            };

            console.log("Creating poll with data:", requestData);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/polls/create`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response.data;
            console.log("Create poll response:", data);

            // Check for api_status === 200 (success)
            if (data.api_status === 200) {
                // Show success message
                console.log("Poll created successfully:", {
                    post_id: data.post_id,
                    poll_id: data.poll_id,
                    post_data: data.post_data,
                    poll_options: data.poll_options
                });
                
                if (showNotification) {
                    showNotification("Poll created successfully!", 'success');
                } else {
                    toast.success("Poll created successfully!");
                }

                // Refresh the feed to show the new poll
                if (fetchNewFeeds) {
                    fetchNewFeeds();
                }

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

                // Reset poll state
                resetPoll();
            } else {
                const errorMessage = data.message || "Failed to create poll";
                console.error("Failed to create poll:", errorMessage);
                if (showNotification) {
                    showNotification(errorMessage, 'error');
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (error) {
            console.error("Error creating poll:", error);
            const errorMessage = error.response?.data?.message || error.message || "Error creating poll. Please try again.";
            if (showNotification) {
                showNotification(errorMessage, 'error');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };



    const createNewPost = async (postText, selectedFiles, pollData = null) => {
        // Validation: Check if post has any content
        const hasText = postText && postText.trim().length > 0;
        const hasFiles = selectedFiles && selectedFiles.length > 0;
        const hasLink = postLink && postLink.trim().length > 0;
        const hasYoutubeLink = youtubeLink && youtubeLink.trim().length > 0;
        const hasAlbumName = albumName && albumName.trim().length > 0;
        const hasGif = selectedGif && selectedGif.url;
        const hasFeeling = selectedFeeling && selectedFeeling.value;
        const hasActivity = selectedActivity && selectedActivity.value;
        
        // Check if poll is valid (if showPoll is true, it must have question and at least one option)
        let hasValidPoll = false;
        if (pollData && pollData.showPoll) {
            const hasPollQuestion = pollData.pollQuestion && pollData.pollQuestion.trim().length > 0;
            const hasPollOptions = pollData.pollOptions && pollData.pollOptions.some(opt => opt && opt.trim().length > 0);
            hasValidPoll = hasPollQuestion && hasPollOptions;
        }

        // If nothing is provided, show error and return
        if (!hasText && !hasFiles && !hasLink && !hasYoutubeLink && !hasAlbumName && !hasValidPoll && !hasGif && !hasFeeling && !hasActivity) {
            const errorMessage = "Please add some content to your post.";
            if (showNotification) {
                showNotification(errorMessage, 'error');
            } else {
                toast.error(errorMessage);
            }
            return;
        }

        // If there's a valid poll and no files/media, use the dedicated poll API
        if (hasValidPoll && !hasFiles && !hasLink && !hasYoutubeLink && !hasAlbumName && !hasGif && !hasFeeling && !hasActivity) {
            await createPoll(pollData.pollQuestion, pollData.pollOptions, postText);
            return;
        }

        // If there's a GIF and no other media, use the GIF API endpoint
        if (hasGif && !hasFiles && !hasLink && !hasYoutubeLink && !hasAlbumName && !hasValidPoll && !hasFeeling && !hasActivity) {
            await createGifPost(postText, selectedGif);
            return;
        }

        // If there's a feeling and no other media, use the feeling API endpoint
        if (hasFeeling && !hasFiles && !hasLink && !hasYoutubeLink && !hasAlbumName && !hasValidPoll && !hasGif && !hasActivity) {
            await createFeelingPost(postText, selectedFeeling.value);
            return;
        }

        // If there's an activity and no other media, use the activity API endpoint
        if (hasActivity && !hasFiles && !hasLink && !hasYoutubeLink && !hasAlbumName && !hasValidPoll && !hasGif && !hasFeeling) {
            await createActivityPost(postText, selectedActivity.type, selectedActivity.value);
            return;
        }

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
                setSelectedFeeling(null);
                setSelectedActivity(null);
                setBackgroundColor("");
                setAlbumName("");
                setGroupId("");
                setPostType("text");
                setPostPrivacy("0");
                setShowGifSearch(false);
                setShowFeelingModal(false);
                setShowActivityModal(false);
                setCurrentActivityType(null);

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
                        src={userData?.avatar_url || "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover absolute left-2 top-1/2 -translate-y-1/2"
                        onError={(e) => {
                            e.target.src = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
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
                // GIF search props
                showGifSearch={showGifSearch}
                setShowGifSearch={setShowGifSearch}
                gifSearchQuery={gifSearchQuery}
                setGifSearchQuery={setGifSearchQuery}
                gifResults={gifResults}
                gifLoading={gifLoading}
                handleGifSelect={handleGifSelect}
                searchGifs={searchGifs}
                // Feeling props
                showFeelingModal={showFeelingModal}
                setShowFeelingModal={setShowFeelingModal}
                selectedFeeling={selectedFeeling}
                setSelectedFeeling={setSelectedFeeling}
                // Activity props
                showActivityModal={showActivityModal}
                setShowActivityModal={setShowActivityModal}
                currentActivityType={currentActivityType}
                setCurrentActivityType={setCurrentActivityType}
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                createActivityPost={createActivityPost}
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
    albumName, setAlbumName, groupId, setGroupId, postType, setPostType, postPrivacy, setPostPrivacy,
    // GIF search props
    showGifSearch, setShowGifSearch, gifSearchQuery, setGifSearchQuery,
    gifResults, gifLoading, handleGifSelect, searchGifs,
    // Feeling props
    showFeelingModal, setShowFeelingModal, selectedFeeling, setSelectedFeeling,
    // Activity props
    showActivityModal, setShowActivityModal, currentActivityType, setCurrentActivityType,
    selectedActivity, setSelectedActivity, createActivityPost
}) => {
    const { userData } = useUser();
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
                toast.error('Please enter a poll question');
                return;
            }
            if (!pollOptions.some(opt => opt.trim())) {
                toast.error('Please enter at least one poll option');
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
                            src={userData?.avatar_url || "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80"}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                                e.target.src = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
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
                        placeholder={
                            showPoll ? "What's on your mind? (Poll will be included)" :
                            selectedActivity ? `${selectedActivity.label}...` :
                            selectedFeeling ? `Feeling ${selectedFeeling.label}...` :
                            "What's on your mind?"
                        }
                        className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 min-h-[120px]"
                        rows="5"
                    />
                    {/* Show activity in post text preview */}
                    {selectedActivity && !postText.includes(selectedActivity.label) && (
                        <div className="mt-2 text-sm text-gray-500 italic">
                            Your post will include: {selectedActivity.label}
                        </div>
                    )}

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

                    {/* Selected GIF Preview */}
                    {selectedGif && (
                        <div className="mt-4 mb-4 p-3 bg-pink-50 rounded-lg border border-pink-200 relative">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-pink-800">Selected GIF</span>
                                <button
                                    onClick={() => setSelectedGif(null)}
                                    className="p-1 text-pink-600 hover:text-pink-800 hover:bg-pink-100 rounded-full transition-colors"
                                    title="Remove GIF"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <img
                                src={selectedGif.preview || selectedGif.url}
                                alt={selectedGif.title || 'Selected GIF'}
                                className="w-full h-48 object-cover rounded-md border border-pink-300"
                            />
                        </div>
                    )}

                    {/* Selected Feeling Preview */}
                    {selectedFeeling && (
                        <div className="mt-4 mb-4 p-3 bg-teal-50 rounded-lg border border-teal-200 relative">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-teal-800">Feeling</span>
                                <button
                                    onClick={() => {
                                        setSelectedFeeling(null);
                                        setFeeling("");
                                    }}
                                    className="p-1 text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded-full transition-colors"
                                    title="Remove Feeling"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selectedFeeling.emoji}</span>
                                <span className="text-gray-800 font-medium">{selectedFeeling.label}</span>
                            </div>
                        </div>
                    )}

                    {/* Selected Activity Preview */}
                    {selectedActivity && (
                        <div className={`mt-4 mb-4 p-3 rounded-lg border relative ${
                            selectedActivity.type === 'traveling' ? 'bg-blue-50 border-blue-200' :
                            selectedActivity.type === 'listening' ? 'bg-cyan-50 border-cyan-200' :
                            selectedActivity.type === 'watching' ? 'bg-pink-50 border-pink-200' :
                            selectedActivity.type === 'playing' ? 'bg-orange-50 border-orange-200' :
                            'bg-red-50 border-red-200'
                        }`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${
                                    selectedActivity.type === 'traveling' ? 'text-blue-800' :
                                    selectedActivity.type === 'listening' ? 'text-cyan-800' :
                                    selectedActivity.type === 'watching' ? 'text-pink-800' :
                                    selectedActivity.type === 'playing' ? 'text-orange-800' :
                                    'text-red-800'
                                }`}>
                                    {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)}
                                </span>
                                <button
                                    onClick={() => {
                                        setSelectedActivity(null);
                                    }}
                                    className={`p-1 rounded-full transition-colors ${
                                        selectedActivity.type === 'traveling' ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-100' :
                                        selectedActivity.type === 'listening' ? 'text-cyan-600 hover:text-cyan-800 hover:bg-cyan-100' :
                                        selectedActivity.type === 'watching' ? 'text-pink-600 hover:text-pink-800 hover:bg-pink-100' :
                                        selectedActivity.type === 'playing' ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-100' :
                                        'text-red-600 hover:text-red-800 hover:bg-red-100'
                                    }`}
                                    title={`Remove ${selectedActivity.type}`}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{selectedActivity.emoji || '📍'}</span>
                                <span className="text-gray-800 font-medium">{selectedActivity.label}</span>
                            </div>
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

                            {/* Reactions/Activities - Main Button */}
                            <button
                                className={`flex items-center space-x-3 p-3 cursor-pointer transition-all duration-200 ${
                                    selectedFeeling || selectedActivity ? 'bg-teal-100 rounded-lg border-2 border-teal-300' : 'hover:bg-teal-50'
                                }`}
                                onClick={() => setShowActivityModal(true)}
                                title={selectedFeeling || selectedActivity ? `${selectedFeeling?.label || selectedActivity?.label} selected - click to change` : "Select reaction or activity"}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                    selectedFeeling || selectedActivity ? 'bg-teal-200' : 'bg-yellow-100'
                                }`}>
                                    <Smile className={`w-5 h-5 transition-colors ${
                                        selectedFeeling || selectedActivity ? 'text-teal-700' : 'text-yellow-600'
                                    }`} />
                                </div>
                                <span className={`font-medium transition-colors ${
                                    selectedFeeling || selectedActivity ? 'text-teal-800' : 'text-gray-700'
                                }`}>
                                    {selectedFeeling ? selectedFeeling.label : 
                                     selectedActivity ? selectedActivity.label : 
                                     'Reactions'}
                                </span>
                            </button>

                            {/* GIF */}
                            <button
                                className={`flex items-center space-x-3 p-3 cursor-pointer transition-all duration-200 ${selectedGif ? 'bg-pink-100 rounded-lg border-2 border-pink-300' : 'hover:bg-pink-50'}`}
                                onClick={() => setShowGifSearch(true)}
                                title={selectedGif ? "GIF selected - click to change" : "Search and add GIF"}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${selectedGif ? 'bg-pink-200' : 'bg-pink-100'}`}>
                                    <Icon icon="mdi:gif" className={`w-5 h-5 transition-colors ${selectedGif ? 'text-pink-700' : 'text-pink-600'}`} />
                                </div>
                                <span className={`font-medium transition-colors ${selectedGif ? 'text-pink-800' : 'text-gray-700'}`}>
                                    {selectedGif ? 'GIF Selected' : 'GIF'}
                                </span>
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

                        {/* Feeling Display (if selected) */}
                        {selectedFeeling && (
                            <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{selectedFeeling.emoji}</span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Feeling</p>
                                            <p className="text-gray-800 font-semibold">{selectedFeeling.label}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedFeeling(null);
                                            setFeeling("");
                                        }}
                                        className="p-1 text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded-full transition-colors"
                                        title="Remove Feeling"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

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

            {/* GIF Search Modal */}
            {showGifSearch && (
                <GifSearchModal
                    isOpen={showGifSearch}
                    onClose={() => {
                        setShowGifSearch(false);
                        setGifSearchQuery('');
                    }}
                    searchQuery={gifSearchQuery}
                    setSearchQuery={setGifSearchQuery}
                    gifResults={gifResults}
                    gifLoading={gifLoading}
                    onSelectGif={handleGifSelect}
                    onLoadMore={() => {
                        const nextPage = Math.floor(gifResults.length / 20);
                        searchGifs(gifSearchQuery, nextPage * 20);
                    }}
                />
            )}

            {/* Feeling Selection Modal */}
            {showFeelingModal && (
                <FeelingSelectionModal
                    isOpen={showFeelingModal}
                    onClose={() => setShowFeelingModal(false)}
                    onSelectFeeling={(feeling) => {
                        setSelectedFeeling(feeling);
                        setFeeling(feeling.value);
                        setShowFeelingModal(false);
                    }}
                    selectedFeeling={selectedFeeling}
                />
            )}

            {/* Activity Selection Modal */}
            {showActivityModal && currentActivityType && (
                <ActivitySelectionModal
                    isOpen={showActivityModal}
                    onClose={() => {
                        setShowActivityModal(false);
                        setCurrentActivityType(null);
                    }}
                    activityType={currentActivityType}
                    onSelectActivity={(activity) => {
                        setSelectedActivity(activity);
                        setShowActivityModal(false);
                        setCurrentActivityType(null);
                    }}
                    selectedActivity={selectedActivity}
                />
            )}

            {/* Reactions/Activities Main Modal */}
            {showActivityModal && !currentActivityType && (
                <ReactionsMainModal
                    isOpen={showActivityModal}
                    onClose={() => {
                        setShowActivityModal(false);
                        setCurrentActivityType(null);
                    }}
                    onSelectActivityType={(type) => {
                        if (type === 'feeling') {
                            setShowActivityModal(false);
                            setShowFeelingModal(true);
                        } else {
                            setCurrentActivityType(type);
                        }
                    }}
                    selectedFeeling={selectedFeeling}
                    selectedActivity={selectedActivity}
                    onClearSelection={() => {
                        setSelectedFeeling(null);
                        setSelectedActivity(null);
                        setFeeling("");
                    }}
                />
            )}
        </div >

    );
};

// GIF Search Modal Component
const GifSearchModal = ({ isOpen, onClose, searchQuery, setSearchQuery, gifResults, gifLoading, onSelectGif, onLoadMore }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-2 md:px-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Search GIFs</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-4 md:p-6 border-b border-gray-200">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for GIFs..."
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            autoFocus
                        />
                        <Icon
                            icon="mdi:magnify"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        />
                    </div>
                    {!searchQuery && (
                        <p className="mt-2 text-sm text-gray-500">Showing trending GIFs</p>
                    )}
                </div>

                {/* GIF Results */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {gifLoading && gifResults.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-600">Loading GIFs...</span>
                            </div>
                        </div>
                    ) : gifResults.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Icon icon="mdi:gif" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600">No GIFs found. Try a different search.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {gifResults.map((gif) => (
                                <button
                                    key={gif.id}
                                    onClick={() => onSelectGif(gif)}
                                    className="relative group aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-pink-500 transition-all cursor-pointer"
                                >
                                    <img
                                        src={gif.preview}
                                        alt={gif.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <Icon
                                            icon="mdi:check-circle"
                                            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {gifResults.length > 0 && !gifLoading && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={onLoadMore}
                                disabled={gifLoading}
                                className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {gifLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}

                    {gifLoading && gifResults.length > 0 && (
                        <div className="flex justify-center mt-4">
                            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Feeling Selection Modal Component
const FeelingSelectionModal = ({ isOpen, onClose, onSelectFeeling, selectedFeeling }) => {
    // List of feelings with emojis
    const feelings = [
        { emoji: '😊', label: 'Happy', value: 'happy', color: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' },
        { emoji: '😢', label: 'Sad', value: 'sad', color: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300' },
        { emoji: '😍', label: 'Loved', value: 'loved', color: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-300' },
        { emoji: '😮', label: 'Surprised', value: 'surprised', color: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-300' },
        { emoji: '😡', label: 'Angry', value: 'angry', color: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-300' },
        { emoji: '😴', label: 'Sleepy', value: 'sleepy', color: 'bg-indigo-100', textColor: 'text-indigo-700', borderColor: 'border-indigo-300' },
        { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300' },
        { emoji: '😎', label: 'Cool', value: 'cool', color: 'bg-cyan-100', textColor: 'text-cyan-700', borderColor: 'border-cyan-300' },
        { emoji: '🤗', label: 'Grateful', value: 'grateful', color: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-300' },
        { emoji: '😰', label: 'Anxious', value: 'anxious', color: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-300' },
        { emoji: '😤', label: 'Determined', value: 'determined', color: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-300' },
        { emoji: '🥳', label: 'Celebrating', value: 'celebrating', color: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' },
        { emoji: '😌', label: 'Relieved', value: 'relieved', color: 'bg-teal-100', textColor: 'text-teal-700', borderColor: 'border-teal-300' },
        { emoji: '😋', label: 'Playful', value: 'playful', color: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-300' },
        { emoji: '🤩', label: 'Excited', value: 'excited', color: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-300' },
        { emoji: '😇', label: 'Blessed', value: 'blessed', color: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300' },
        { emoji: '😏', label: 'Sneaky', value: 'sneaky', color: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300' },
        { emoji: '🥰', label: 'Loved', value: 'loved', color: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-300' },
        { emoji: '😭', label: 'Crying', value: 'crying', color: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300' },
        { emoji: '🤪', label: 'Crazy', value: 'crazy', color: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-300' },
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-2 md:px-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">How are you feeling?</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Feelings Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {feelings.map((feeling) => (
                            <button
                                key={feeling.value}
                                onClick={() => onSelectFeeling(feeling)}
                                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                                    selectedFeeling?.value === feeling.value
                                        ? `${feeling.color} ${feeling.borderColor} border-2`
                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <span className="text-4xl mb-2">{feeling.emoji}</span>
                                <span className={`text-sm font-medium ${selectedFeeling?.value === feeling.value ? feeling.textColor : 'text-gray-700'}`}>
                                    {feeling.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Reactions Main Modal Component - Shows all activity types
const ReactionsMainModal = ({ isOpen, onClose, onSelectActivityType, selectedFeeling, selectedActivity, onClearSelection }) => {
    const activities = [
        { 
            type: 'feeling', 
            label: 'Feeling', 
            emoji: '😊', 
            color: 'bg-yellow-100', 
            textColor: 'text-yellow-700', 
            borderColor: 'border-yellow-300',
            description: 'How are you feeling?'
        },
        { 
            type: 'traveling', 
            label: 'Traveling to', 
            emoji: '✈️', 
            color: 'bg-blue-100', 
            textColor: 'text-blue-700', 
            borderColor: 'border-blue-300',
            description: 'Where are you traveling?'
        },
        { 
            type: 'listening', 
            label: 'Listening to', 
            emoji: '🎵', 
            color: 'bg-cyan-100', 
            textColor: 'text-cyan-700', 
            borderColor: 'border-cyan-300',
            description: 'What are you listening to?'
        },
        { 
            type: 'watching', 
            label: 'Watching', 
            emoji: '📺', 
            color: 'bg-pink-100', 
            textColor: 'text-pink-700', 
            borderColor: 'border-pink-300',
            description: 'What are you watching?'
        },
        { 
            type: 'playing', 
            label: 'Playing', 
            emoji: '🎮', 
            color: 'bg-orange-100', 
            textColor: 'text-orange-700', 
            borderColor: 'border-orange-300',
            description: 'What are you playing?'
        },
        { 
            type: 'reaction', 
            label: 'Reaction', 
            emoji: '👍', 
            color: 'bg-red-100', 
            textColor: 'text-red-700', 
            borderColor: 'border-red-300',
            description: 'Select a reaction'
        },
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getSelectedActivity = () => {
        if (selectedFeeling) {
            return { type: 'feeling', label: selectedFeeling.label, emoji: selectedFeeling.emoji };
        }
        if (selectedActivity) {
            return selectedActivity;
        }
        return null;
    };

    const selected = getSelectedActivity();

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-2 md:px-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Reactions & Activities</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Selected Activity Display */}
                {selected && (
                    <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selected.emoji}</span>
                                <div>
                                    <p className="text-sm text-gray-600">Currently selected:</p>
                                    <p className="text-gray-800 font-semibold">{selected.label}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClearSelection}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                {/* Activities Grid */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {activities.map((activity) => {
                            const isSelected = (selectedFeeling && activity.type === 'feeling') || 
                                             (selectedActivity && selectedActivity.type === activity.type);
                            return (
                                <button
                                    key={activity.type}
                                    onClick={() => onSelectActivityType(activity.type)}
                                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                                        isSelected
                                            ? `${activity.color} ${activity.borderColor} border-2`
                                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <span className="text-5xl mb-3">{activity.emoji}</span>
                                    <span className={`text-base font-semibold mb-1 ${
                                        isSelected ? activity.textColor : 'text-gray-700'
                                    }`}>
                                        {activity.label}
                                    </span>
                                    <span className="text-xs text-gray-500 text-center">
                                        {activity.description}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Activity Selection Modal Component (Traveling, Listening, Watching, Playing, Reaction)
const ActivitySelectionModal = ({ isOpen, onClose, activityType, onSelectActivity, selectedActivity }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedReaction, setSelectedReaction] = useState(null);

    // Reactions for reaction type
    const reactions = [
        { emoji: '👍', label: 'Like', value: 'like' },
        { emoji: '❤️', label: 'Love', value: 'love' },
        { emoji: '😂', label: 'Haha', value: 'haha' },
        { emoji: '😮', label: 'Wow', value: 'wow' },
        { emoji: '😢', label: 'Sad', value: 'sad' },
        { emoji: '😡', label: 'Angry', value: 'angry' },
    ];

    // Activity type configurations
    const activityConfig = {
        traveling: {
            title: 'Traveling to',
            placeholder: 'Where are you traveling? (e.g., Paris, New York)',
            emoji: '✈️',
            prefix: 'Traveling to'
        },
        listening: {
            title: 'Listening to',
            placeholder: 'What are you listening to? (e.g., Song Name, Artist)',
            emoji: '🎵',
            prefix: 'Listening to'
        },
        watching: {
            title: 'Watching',
            placeholder: 'What are you watching? (e.g., Movie Name, TV Show)',
            emoji: '📺',
            prefix: 'Watching'
        },
        playing: {
            title: 'Playing',
            placeholder: 'What are you playing? (e.g., Game Name, Sport)',
            emoji: '🎮',
            prefix: 'Playing'
        },
        reaction: {
            title: 'Reaction',
            placeholder: 'Select a reaction',
            emoji: '😊',
            prefix: 'Reaction'
        }
    };

    const config = activityConfig[activityType] || {};

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Pre-fill if activity is already selected
            if (selectedActivity && selectedActivity.type === activityType) {
                if (activityType === 'reaction') {
                    setSelectedReaction(selectedActivity.value);
                } else {
                    setInputValue(selectedActivity.value);
                }
            } else {
                setInputValue('');
                setSelectedReaction(null);
            }
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, activityType, selectedActivity]);

    if (!isOpen || !activityType) return null;

    const handleSubmit = () => {
        if (activityType === 'reaction') {
            if (!selectedReaction) {
                toast.error('Please select a reaction');
                return;
            }
            const reaction = reactions.find(r => r.value === selectedReaction);
            onSelectActivity({
                type: 'reaction',
                value: selectedReaction,
                label: `${reaction.emoji} ${reaction.label}`,
                emoji: reaction.emoji
            });
        } else {
            if (!inputValue.trim()) {
                toast.error(`Please enter ${config.title.toLowerCase()}`);
                return;
            }
            onSelectActivity({
                type: activityType,
                value: inputValue.trim(),
                label: `${config.prefix} ${inputValue.trim()}`,
                emoji: config.emoji
            });
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-2 md:px-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{config.emoji}</span>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{config.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {activityType === 'reaction' ? (
                        // Reaction Selection
                        <div>
                            <p className="text-gray-600 mb-4">Select a reaction:</p>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {reactions.map((reaction) => (
                                    <button
                                        key={reaction.value}
                                        onClick={() => setSelectedReaction(reaction.value)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
                                            selectedReaction === reaction.value
                                                ? 'bg-blue-100 border-blue-500'
                                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-4xl mb-2">{reaction.emoji}</span>
                                        <span className={`text-sm font-medium ${
                                            selectedReaction === reaction.value ? 'text-blue-700' : 'text-gray-700'
                                        }`}>
                                            {reaction.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Text Input for other activities
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {config.title}
                            </label>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={config.placeholder}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSubmit();
                                    }
                                }}
                            />
                            {selectedActivity && selectedActivity.type === activityType && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-sm text-gray-600">Current: {selectedActivity.label}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                        {selectedActivity && selectedActivity.type === activityType ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};