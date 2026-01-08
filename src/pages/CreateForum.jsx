import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';

const CreateForum = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [joinPrivacy, setJoinPrivacy] = useState('public');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [privacyTypes, setPrivacyTypes] = useState(['public', 'private']);
    const [joinPrivacyTypes, setJoinPrivacyTypes] = useState(['public', 'private']);
    const [fetchingMetadata, setFetchingMetadata] = useState(true);

    // Fetch metadata (categories and types)
    const getMetadata = async () => {
        try {
            setFetchingMetadata(true);
            const accessToken = localStorage.getItem('access_token');
            const res = await axios.get(`${baseUrl}/api/v1/forums/meta`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            console.log('Metadata response:', res.data);
            console.log('Response status:', res.status);
            
            // Check if response is successful - be more lenient with the check
            const isSuccess = res.data?.ok === true || 
                            res.data?.api_status === 200 || 
                            res.status === 200 || 
                            res.statusText === 'OK' ||
                            (res.data && (res.data.data || res.data.categories || res.data.types));
            
            if (isSuccess) {
                // Try to get metadata from different possible locations
                const metadata = res.data?.data || res.data || {};
                
                console.log('Metadata extracted:', metadata);
                
                // Set categories
                if (metadata.categories && Array.isArray(metadata.categories)) {
                    setCategories(metadata.categories);
                    // Set default category to first one if category is not set
                    if (metadata.categories.length > 0) {
                        setCategory(prev => prev || metadata.categories[0].id.toString());
                    }
                } else {
                    console.warn('No categories found in metadata');
                }
                
                // Set privacy types
                if (metadata.types?.privacy && Array.isArray(metadata.types.privacy)) {
                    setPrivacyTypes(metadata.types.privacy);
                }
                
                // Set join privacy types
                if (metadata.types?.join_privacy && Array.isArray(metadata.types.join_privacy)) {
                    setJoinPrivacyTypes(metadata.types.join_privacy);
                }
            } else {
                console.error('Unexpected response format:', res.data);
                toast.error('Failed to load forum metadata: Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching forum metadata:', error);
            console.error('Error response:', error?.response?.data);
            console.error('Error status:', error?.response?.status);
            
            // Only show error toast if it's a real error, not if we got data
            if (error?.response?.status !== 200 && error?.response?.status !== undefined) {
                toast.error(error?.response?.data?.message || 'Failed to load forum metadata');
            } else if (!error?.response) {
                // Network error or other issue
                toast.error('Failed to load forum metadata. Please check your connection.');
            }
        } finally {
            setFetchingMetadata(false);
        }
    };

    useEffect(() => {
        getMetadata();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Please enter forum name');
            return;
        }

        if (!description.trim()) {
            toast.error('Please enter forum description');
            return;
        }

        if (!category) {
            toast.error('Please select a category');
            return;
        }

        const formData = {
            name: name.trim(),
            description: description.trim(),
            category: parseInt(category),
            privacy: privacy,
            join_privacy: joinPrivacy
        };

        const accessToken = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseUrl}/api/v1/forums`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                }
            );

            const data = response.data;
            console.log('Forum creation response:', data);

            if (data?.ok === true || response.status === 200 || response.status === 201) {
                toast.success(data?.message || 'Forum created successfully!');
                
                // Navigate to forum page
                setTimeout(() => {
                    navigate('/forum');
                }, 800);

                // Reset form
                setName('');
                setDescription('');
                setCategory('');
                setPrivacy('public');
                setJoinPrivacy('public');
            } else {
                toast.error(data?.message || 'Failed to create forum');
            }
        } catch (error) {
            console.error('Error creating forum:', error);
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to create forum';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingMetadata) {
        return <Loader />;
    }

    return (
        <div className="bg-[#EDF6F9] w-full min-h-screen flex items-center justify-start flex-col">
            {/* Sticky Header */}
            <div className="w-full h-[98px] sticky pt-8 top-0 z-11 bg-[#EDF6F9]">
                <div className="flex items-center justify-between h-full px-4 md:px-7 flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-[#212121]">Create Forum</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate('/forum')}
                            className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
                        >
                            ← Back to Forum
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Card */}
            <div className="w-[95%] md:w-[90%] max-w-6xl bg-white flex flex-col gap-6 rounded-xl my-6 shadow-md overflow-hidden">
                {/* Hero Banner */}
                <div className="relative h-64 flex items-start justify-end px-8 md:px-16">
                    {/* Wave SVG */}
                    <img src="/Vectorgroup.svg" alt="vector" className='absolute bottom-0 right-0 top-0 w-full' />
                    <h2 className="text-xl md:text-2xl font-bold text-white z-10 pt-6">
                        Create New Forum
                    </h2>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8"
                >
                    {/* Forum Name */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="forum-name"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Forum Name : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="forum-name"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="e.g., Tech Discussion"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="forum-description"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Description : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="forum-description"
                            rows="4"
                            className="w-full p-2 px-4 border border-[#212121] rounded-xl"
                            placeholder="Describe what this forum is about..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="forum-category"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Category : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="forum-category"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select category</option>
                                {categories?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                        {category && categories.find(cat => cat.id.toString() === category)?.description && (
                            <p className="text-sm text-gray-500">
                                {categories.find(cat => cat.id.toString() === category).description}
                            </p>
                        )}
                    </div>

                    {/* Privacy */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="forum-privacy"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Privacy : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="forum-privacy"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={privacy}
                                onChange={(e) => setPrivacy(e.target.value)}
                                required
                            >
                                {privacyTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Join Privacy */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="forum-join-privacy"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Join Privacy : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="forum-join-privacy"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={joinPrivacy}
                                onChange={(e) => setJoinPrivacy(e.target.value)}
                                required
                            >
                                {joinPrivacyTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type === 'public' 
                                            ? 'Public (Anyone can join)' 
                                            : 'Private (Requires approval)'}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[16rem] md:w-[20rem] h-[50px] border border-[#A3D36C] text-[#76B82A] font-semibold text-[18px] md:text-[20px] py-2 px-8 rounded-lg hover:bg-[#8BC34B] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Forum'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateForum;

