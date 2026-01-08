import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';
import { getCategoryName } from '../constants/blogCategories';

const CreateBlog = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [active, setActive] = useState(1);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(true);

    const getCategories = async () => {
        try {
            setFetchingCategories(true);
            // Fetch blog categories from categories endpoint
            const res = await axios.get(`${baseUrl}/api/v1/blogs/categories`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (res.data?.api_status === 200 && res.data?.data) {
                // Extract categories from data.categories array
                const categoriesData = res.data.data.categories || res.data.data || [];
                setCategories(categoriesData);
            } else if (res.data?.ok === true) {
                // Fallback for alternative response format
                const categoriesData = res.data?.data?.categories || res.data?.categories || res.data?.data || [];
                setCategories(categoriesData);
            }
        } catch (error) {
            console.log('Error fetching categories:', error);
            // If categories endpoint doesn't exist, use default categories
            setCategories([
                { id: 1, name: 'General' },
                { id: 2, name: 'Technology' },
                { id: 3, name: 'Lifestyle' },
                { id: 4, name: 'Business' },
                { id: 5, name: 'Entertainment' },
            ]);
        } finally {
            setFetchingCategories(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Please enter blog title');
            return;
        }

        if (!description.trim()) {
            toast.error('Please enter blog description');
            return;
        }

        if (!content.trim()) {
            toast.error('Please enter blog content');
            return;
        }

        if (!category) {
            toast.error('Please select a category');
            return;
        }

        const formData = {
            title: title.trim(),
            description: description.trim(),
            content: content.trim(),
            category: parseInt(category),
            tags: tags.trim() || '',
            active: active
        };

        const accessToken = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const response = await axios.post(
                `${baseUrl}/api/v1/blogs`,
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
            console.log('Blog creation response:', data);

            if (data?.api_status === 200 || data?.ok === true) {
                toast.success(data?.message || 'Blog created successfully!');
                
                // Navigate to blogs list page
                setTimeout(() => {
                    navigate('/blog');
                }, 800);

                // Reset form
                setTitle('');
                setDescription('');
                setContent('');
                setCategory('');
                setTags('');
                setActive(1);
            } else {
                toast.error(data?.message || 'Failed to create blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to create blog';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCategories) {
        return <Loader />;
    }

    return (
        <div className="bg-[#EDF6F9] w-full min-h-screen flex items-center justify-start flex-col">
            {/* Sticky Header */}
            <div className="w-full h-[98px] sticky pt-8 top-0 z-11 bg-[#EDF6F9]">
                <div className="flex items-center justify-between h-full px-4 md:px-7 flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-[#212121]">Create Blog</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => navigate('/blog')}
                            className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
                        >
                            ← Back to Blogs
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
                        Create Blog Post
                    </h2>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="blog-title"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Title : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="blog-title"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="Enter blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="blog-description"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Description : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="blog-description"
                            rows="3"
                            className="w-full p-2 px-4 border border-[#212121] rounded-xl"
                            placeholder="Enter short description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="blog-content"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Content : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="blog-content"
                            rows="10"
                            className="w-full p-2 px-4 border border-[#212121] rounded-xl"
                            placeholder="Enter full blog content..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="blog-category"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Category : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="blog-category"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select category</option>
                                {categories?.map((cat) => {
                                    const displayName = getCategoryName(cat.id);
                                    return (
                                        <option key={cat.id} value={cat.id}>
                                            {displayName} {cat.articles_count ? `(${cat.articles_count})` : ''}
                                        </option>
                                    );
                                })}
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

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="blog-tags"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Tags :
                        </label>
                        <input
                            type="text"
                            id="blog-tags"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="Enter tags separated by commas (e.g., tech,programming)"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">Separate multiple tags with commas</p>
                    </div>

                    {/* Active Status */}
                    <div className="flex flex-col gap-2">
                        <label className="text-lg text-black flex items-center gap-2">
                            Status :
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="active"
                                    value="1"
                                    checked={active === 1}
                                    onChange={(e) => setActive(parseInt(e.target.value))}
                                    className="cursor-pointer"
                                />
                                <span>Active</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="active"
                                    value="0"
                                    checked={active === 0}
                                    onChange={(e) => setActive(parseInt(e.target.value))}
                                    className="cursor-pointer"
                                />
                                <span>Draft</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[16rem] md:w-[20rem] h-[50px] border border-[#A3D36C] text-[#76B82A] font-semibold text-[18px] md:text-[20px] py-2 px-8 rounded-lg hover:bg-[#8BC34B] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Publishing...' : 'Publish Blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBlog;

