import React, { useEffect, useState } from 'react';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { baseUrl } from '../../utils/constant';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreatePage = () => {
    const [pageName, setPageName] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    const [pageDescription, setPageDescription] = useState('');
    const [pageUrl, setPageUrl] = useState('');
    const [pageCategory, setPageCategory] = useState('');
    const [loading,setLoading] = useState(false);
    const [categories,setCategories] = useState([]);

   
    


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pageName.trim()) {
            toast.error('Please enter page name');
            return;
        }

        if (!pageUrl.trim()) {
            toast.error('Please enter page URL');
            return;
        }

        console.log("pageCatt>>",pageCategory);

        if (!pageCategory) {
            toast.error('Please select page category');
            return;
        }

        const formData = {
            page_name:pageName,
            page_title:pageTitle,
            page_description:pageDescription,
            page_url:pageUrl,
            page_category:pageCategory,
        };

        console.log('Submitting form...', formData);
        // alert('Page created successfully!');

        const accessToken = localStorage.getItem("access_token");
        setLoading(true);
        // formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
        // formData.append('type', 'create');
        const response = await axios.post(`${baseUrl}/api/v1/pages`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        })
        const data = await response.data;
        console.log(data, "data");

        if (data.ok === true) {
            toast.success('Page created successfully!');
        } else {
            toast.error('Failed to create page: ' + data.message);
        }

        // Reset form
        setPageName('');
        setPageTitle('');
        setPageDescription('');
        setPageUrl('');
        setPageCategory('');
        setLoading(false);
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
                <div
                    className="relative w-full bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/pagebg.jpg')" }}
                >

                    <div className="relative w-full h-[12rem] md:h-[18rem] flex top-15 justify-end pr-6 md:pr-20 z-10">
                        <h2 className="text-2xl md:text-4xl text-white font-bold text-right drop-shadow-md">
                            Create Page
                        </h2>
                    </div>
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
                        />
                    </div>

                    {/* Page Description */}
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="page-description"
                            className="text-lg text-black flex items-center gap-2"
                        >
                            Page Description :
                        </label>
                        <textarea
                            id="page-description"
                            rows="4"
                            className="w-full p-2 px-4 border border-[#212121] rounded-xl"
                            placeholder="Page Description"
                            value={pageDescription}
                            onChange={(e) => setPageDescription(e.target.value)}
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
                        <input
                            type="url"
                            id="page-url"
                            className="w-full p-2 px-4 border border-[#212121] rounded-full"
                            placeholder="https://ouptel.com/"
                            value={pageUrl}
                            onChange={(e) => setPageUrl(e.target.value)}
                        />
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
                                value={pageCategory}
                                onChange={(e) => setPageCategory(categories.find((category)=>{
                                    console.log("category>>",category.id);
                                    console.log("e.target.value>>",e.target.value);
                                    console.log("category>>",category);
                                    return category.id === e.target.value
                                }))}
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
