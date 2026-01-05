import React, { useState, useEffect } from 'react';
import { baseUrl } from '../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from './loading/Loader';
import { FaTimes } from 'react-icons/fa';

const EditBlogModal = ({ blog, onClose, onUpdate }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [active, setActive] = useState(1);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(true);

    // Initialize form with blog data
    useEffect(() => {
        if (blog) {
            setTitle(blog.title || '');
            setDescription(blog.description || '');
            setContent(blog.content || '');
            setCategory(blog.category?.toString() || '');
            setTags(blog.tags ? (Array.isArray(blog.tags) ? blog.tags.join(',') : blog.tags) : '');
            setActive(blog.active ? 1 : 0);
        }
    }, [blog]);

    const getCategories = async () => {
        try {
            setFetchingCategories(true);
            const res = await axios.get(`${baseUrl}/api/v1/blogs/meta`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (res.data?.ok === true || res.data?.api_status === 200) {
                const categoriesData = res.data?.data?.categories || res.data?.categories || [];
                setCategories(categoriesData);
            }
        } catch (error) {
            console.log('Error fetching categories:', error);
            // Use default categories if API fails
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
            const response = await axios.put(
                `${baseUrl}/api/v1/blogs/${blog.id}`,
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
            console.log('Blog update response:', data);

            if (data?.api_status === 200 || data?.ok === true) {
                toast.success(data?.message || 'Blog updated successfully!');
                
                // Call onUpdate with the updated blog data
                if (onUpdate && data?.data) {
                    onUpdate(data.data);
                } else {
                    // If data structure is different, merge with existing blog
                    onUpdate({ ...blog, ...formData });
                }
            } else {
                toast.error(data?.message || 'Failed to update blog');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update blog';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCategories) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-8">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-[#212121]">Edit Blog</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-6 p-6 md:p-8"
                >
                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="edit-blog-title"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Title : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="edit-blog-title"
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
                            htmlFor="edit-blog-description"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Description : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="edit-blog-description"
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
                            htmlFor="edit-blog-content"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Content : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="edit-blog-content"
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
                            htmlFor="edit-blog-category"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Category : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="edit-blog-category"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                <option value="">Select category</option>
                                {categories?.map((cat, index) => (
                                    <option key={index} value={cat.id}>
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
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="edit-blog-tags"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Tags :
                        </label>
                        <input
                            type="text"
                            id="edit-blog-tags"
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

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlogModal;

