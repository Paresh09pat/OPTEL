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
    const [loading,setLoading] = useState(false);
    const [categories,setCategories] = useState([]);

   
    


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all mandatory fields
        if (!pageName.trim()) {
            toast.error('Please enter page name');
            return;
        }

        if (!pageTitle.trim()) {
            toast.error('Please enter page title');
            return;
        }

        if (!pageDescription.trim()) {
            toast.error('Please enter page description');
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

        // Combine domain with user input for page URL
        const currentDomain = window.location.origin;
        const fullPageUrl = pageUrl.startsWith('/') ? `${currentDomain}${pageUrl}` : `${currentDomain}/${pageUrl}`;

        const formData = {
            page_name:pageName,
            page_title:pageTitle,
            page_description:pageDescription,
            page_url:fullPageUrl,
            page_category:selectedCategoryId,
        };

        console.log('Submitting form...', formData);
        // alert('Page created successfully!');

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

    const getCategories = async()=>{
        try{
            const res = await axios.get(`${baseUrl}/api/v1/pages/meta`);

            console.log("catt>>",res.data);
            if(res.data.ok === true){
                setCategories(res.data?.data?.categories);
                console.log(res.data.categories);
            }
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getCategories();
    },[]);

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
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Page Name : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="page-name"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="Page Name"
                            value={pageName}
                            onChange={(e) => setPageName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-title"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Page Title : <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="page-title"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="Page Title"
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Page Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-description"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Page Description : <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="page-description"
                            rows="4"
                            className="w-full p-2 px-4 border border-[#212121] rounded-xl"
                            placeholder="Page Description"
                            value={pageDescription}
                            onChange={(e) => setPageDescription(e.target.value)}
                            required
                        />
                    </div>

                    {/* Page URL */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-url"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Page URL : <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                            <span className="px-4 py-2 bg-gray-100 border border-r-0 border-[#212121] rounded-l-full text-gray-700 font-medium">
                                {window.location.origin}/
                            </span>
                            <input
                                type="text"
                                id="page-url"
                                className="flex-1 p-2 px-4 border border-[#212121] rounded-r-full focus:outline-none"
                                placeholder="page-name"
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
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Page Category : <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="page-category"
                                className="w-full p-2 px-4 border border-[#212121] rounded-full appearance-none cursor-pointer"
                                value={selectedCategoryId}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    setSelectedCategoryId(selectedId);
                                    const selectedCategory = categories.find(cat => cat.id === selectedId);
                                    setPageCategory(selectedCategory?.name || '');
                                }}
                                required
                            >
                                <option value="">Select category</option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category.id} >
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

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="w-[16rem] md:w-[20rem] h-[50px] border border-[#A3D36C] text-[#76B82A] font-semibold text-[18px] md:text-[20px] py-2 px-8 rounded-lg hover:bg-[#8BC34B] hover:text-white transition"
                        >
                            Publish Page
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePage;
