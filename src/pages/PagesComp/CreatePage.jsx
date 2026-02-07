import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { baseUrl } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatePage = () => {
    const navigate = useNavigate();
    const [pageName, setPageName] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    const [pageDescription, setPageDescription] = useState('');
    const [pageUrl, setPageUrl] = useState('');
    const [pageCategory, setPageCategory] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);





    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all mandatory fields
        if (!pageName.trim()) {
            toast.error('Please enter page name');
            return;
        }

        if (!pageUrl.trim()) {
            toast.error('Please enter page URL');
            return;
        }

        if (!selectedCategoryId) {
            toast.error('Please select page category');
            return;
        }

        if (!selectedSubCategoryId) {
            toast.error('Please select sub category');
            return;
        }

        if (!pageDescription.trim()) {
            toast.error('Please enter page description');
            return;
        }

        // Validate description length
        if (pageDescription.trim().length < 10 || pageDescription.trim().length > 200) {
            toast.error('Page description must be between 10 and 200 characters');
            return;
        }

        const formData = {
            page_name: pageName,
            page_title: pageTitle || pageName, // Use page name as title if not provided
            page_category: parseInt(selectedCategoryId),
            sub_category: parseInt(selectedSubCategoryId),
            website: pageUrl, 
            page_description: pageDescription,
        };

        console.log('Submitting form...', formData);

        const accessToken = localStorage.getItem("access_token");
        setLoading(true);

        try {
            const response = await axios.post(`${baseUrl}/api/v1/pages`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
            const data = await response.data;
            console.log(data, "data");

            if (data.api_status === 200) {
                toast.success('Page created successfully!');
                // Reset form
                setPageName('');
                setPageTitle('');
                setPageDescription('');
                setPageUrl('');
                setPageCategory('');
                setSelectedCategoryId('');
                setSelectedSubCategoryId('');
                setSubCategories([]);
                // Navigate to pages
                navigate('/pagescomp/mainpages');
            } else {
                // Handle errors array from response
                if (data.api_status === 400 && data.errors && Array.isArray(data.errors)) {
                    // Display each error from the errors array
                    data.errors.forEach((error) => {
                        toast.error(error);
                    });
                } else if (data.message) {
                    toast.error('Failed to create page: ' + data.message);
                } else {
                    toast.error('Failed to create page');
                }
            }
        } catch (error) {
            console.error('Error creating page:', error);
            // Handle axios error response
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.api_status === 400 && errorData.errors && Array.isArray(errorData.errors)) {
                    // Display each error from the errors array
                    errorData.errors.forEach((errorMsg) => {
                        toast.error(errorMsg);
                    });
                } else if (errorData.message) {
                    toast.error('Failed to create page: ' + errorData.message);
                } else {
                    toast.error('Failed to create page');
                }
            } else {
                toast.error('Failed to create page. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset all form fields
        setPageName('');
        setPageTitle('');
        setPageDescription('');
        setPageUrl('');
        setPageCategory('');
        setSelectedCategoryId('');
        setSelectedSubCategoryId('');
        setSubCategories([]);
        // Navigate back
        navigate(-1);
    };

    const getCategories = async () => {
        try {
            const res = await axios.get(`${baseUrl}/api/v1/pages/meta`);

            console.log("catt>>", res.data);
            if (res.data.ok === true) {
                setCategories(res.data?.data?.categories);
                console.log(res.data.categories);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }

    const getSubCategories = async (categoryId) => {
        try {
            const res = await axios.get(`${baseUrl}/api/v1/pages/meta?category_id=${categoryId}`);

            console.log("subcatt>>", res.data);
            if (res.data.ok === true) {
                setSubCategories(res.data?.data?.sub_categories || []);
            }
        }
        catch (error) {
            console.log(error);
            setSubCategories([]);
        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className="bg-[#EDF6F9] w-full min-h-screen flex items-center justify-start flex-col">
            {/* Sticky Header */}
            <div className="w-full h-[98px] sticky pt-8 top-0 z-11 bg-[#EDF6F9]">
                <div className="flex items-center justify-between h-full px-4 md:px-7 flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-[#212121]">My Pages</h1>
                    <div className="flex gap-4 items-center">
                        <button className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition">
                            <MdOutlineAddPhotoAlternate className="text-lg" /> Create Page
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
                        Create Page
                    </h2>
                </div>


                {/* Form Section */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-4 md:p-8"
                >
                    {/* Page Name */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-name"
                            className="text-base text-gray-600 font-medium"
                        >
                            Page name
                        </label>
                        <input
                            type="text"
                            id="page-name"
                            className="w-full p-3 px-4  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
                            placeholder=""
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                            required
                        />
                        <p className="text-sm text-gray-400">Your page title</p>
                    </div>

                    {/* Page URL */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-url"
                            className="text-base text-gray-600 font-medium"
                        >
                            Page URL
                        </label>
                        <div className="w-full p-3 px-4  border border-gray-300 rounded-lg flex items-center">
                            <span className="text-gray-500">
                                {window.location.origin}/
                            </span>
                            <input
                                type="text"
                                id="page-url"
                                className="flex-1 bg-transparent border-0 focus:outline-none ml-1"
                                placeholder=""
                                value={pageUrl}
                                onChange={(e) => {
                                    // Remove leading slash if user adds it
                                    const value = e.target.value.replace(/^\//, '');
                                    setPageUrl(value);
                                }}
                                required
                            />
                        </div>
                    </div>

                    {/* Page Category */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-category"
                            className="text-base text-gray-600 font-medium"
                        >
                            Page Category
                        </label>
                        <div className="relative">
                            <select
                                id="page-category"
                                className="w-full p-3 px-4  border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
                                value={selectedCategoryId}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    setSelectedCategoryId(selectedId);
                                    const selectedCategory = categories.find(cat => cat.id == selectedId);
                                    setPageCategory(selectedCategory?.name || '');
                                    // Reset subcategory when category changes
                                    setSelectedSubCategoryId('');
                                    // Fetch subcategories
                                    if (selectedId) {
                                        getSubCategories(selectedId);
                                    } else {
                                        setSubCategories([]);
                                    }
                                }}
                                required
                            >
                                <option value="">Select category</option>
                                {categories?.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
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

                    {/* Sub Category */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="sub-category"
                            className="text-base text-gray-600 font-medium"
                        >
                            Sub Category
                        </label>
                        <div className="relative">
                            <select
                                id="sub-category"
                                className="w-full p-3 px-4  border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                                value={selectedSubCategoryId}
                                onChange={(e) => {
                                    setSelectedSubCategoryId(e.target.value);
                                }}
                                disabled={!selectedCategoryId || subCategories.length === 0}
                                required
                            >
                                <option value="">Select sub category</option>
                                {subCategories?.map((subCategory) => (
                                    <option key={subCategory.id} value={subCategory.id}>
                                        {subCategory.name}
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

                    {/* Page Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-description"
                            className="text-base text-gray-600 font-medium"
                        >
                            Page description
                        </label>
                        <textarea
                            id="page-description"
                            rows="5"
                            className="w-full p-3 px-4  border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
                            placeholder=""
                            value={pageDescription}
                            onChange={(e) => setPageDescription(e.target.value)}
                            required
                        />
                        <p className="text-sm text-gray-400">Your Page description. Between 10 and 200 characters max.</p>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-[16rem] md:w-[15rem] h-[50px] border border-gray-400 text-gray-700 font-semibold text-[15px] md:text-[18px] py-2 px-8 rounded-lg hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-[16rem] md:w-[15rem] h-[50px] bg-blue-600 text-white font-semibold text-[15px] md:text-[18px] py-2 px-8 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Publishing...' : 'Publish Page'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePage;
