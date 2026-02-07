// components/GeneralSettings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../../utils/constant';

const GeneralSettings = ({ formData, handleChange }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper function to extract path from full URL
  const extractPathFromUrl = (url) => {
    if (!url) return '';
    try {
      // If it's a full URL, extract the path
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const urlObj = new URL(url);
        // Decode URI component to convert %20 to spaces
        let path = decodeURIComponent(urlObj.pathname);
        // Remove leading slash to avoid double slashes
        path = path.startsWith('/') ? path.substring(1) : path;
        return path;
      }
      // If it's already a path, decode and remove leading slash
      let path = decodeURIComponent(url);
      path = path.startsWith('/') ? path.substring(1) : path;
      return path;
    } catch (error) {
      // If URL parsing fails, try to decode and remove leading slash
      try {
        let path = decodeURIComponent(url);
        path = path.startsWith('/') ? path.substring(1) : path;
        return path;
      } catch {
        return url;
      }
    }
  };

  // Fetch categories from API
  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/api/v1/pages/meta`);

      if (res.data.ok === true) {
        setCategories(res.data?.data?.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories based on selected category
  const getSubCategories = async (categoryId) => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/pages/meta?category_id=${categoryId}`);

      if (res.data.ok === true) {
        setSubCategories(res.data?.data?.sub_categories || []);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategories([]);
    }
  };

  // Load categories on component mount
  useEffect(() => {
    getCategories();
  }, []);

  // Load subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      getSubCategories(formData.category);
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    handleChange(e);
    // Reset subcategory when category changes
    handleChange({ target: { name: 'subCategory', value: '' } });
  };

  return (
    <div className="bg-white rounded-xl p-3.5 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-2">General Setting</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Page Name : <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pageName"
            value={formData.pageName}
            onChange={handleChange}
            placeholder="Page Name"
            className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category :</label>
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              disabled={loading}
              className={`w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                loading ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="" disabled hidden>
                {loading ? 'Loading categories...' : 'Select Category'}
              </option>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category :</label>
          <div className="relative">
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              disabled={!formData.category || subCategories.length === 0}
              className={`w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1153e7] ${
                !formData.category || subCategories.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="" disabled hidden>
                Select Sub-Category
              </option>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Page URL :</label>
          <div className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl flex items-center bg-white">
            <span className="text-gray-500 select-none pointer-events-none">
              https://ouptel.in/
            </span>
            <input
              type="text"
              name="pageUrl"
              value={extractPathFromUrl(formData.pageUrl)}
              onChange={handleChange}
              placeholder="page/your-page-name"
              className="flex-1 bg-transparent border-0 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Call to action :</label>
          <div className="relative">
            <select
              name="callToAction"
              value={formData.callToAction}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
            >
              <option value="" disabled hidden>Select action</option>
              <option value="read_more">Read more</option>
              <option value="shop_now">Shop now</option>
              <option value="view_more">View more</option>
              <option value="visit_now">Visit now</option>
              <option value="book_now">Book now</option>
              <option value="learn_more">Learn more</option>
              <option value="play_now">Play now</option>
              <option value="bet_now">Bet now</option>
              <option value="donate">Donate</option>
              <option value="apply">Apply</option>
              <option value="quote">Quote</option>
              <option value="order">Order</option>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Call to target url :</label>
          <input
            type="url"
            name="callToTargetUrl"
            value={formData.callToTargetUrl}
            onChange={handleChange}
            placeholder="Url"
            className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Users can post on my page :</label>
          <div className="flex space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="canPost"
                value="enable"
                checked={formData.canPost === 'enable'}
                onChange={handleChange}
                className="mr-2 accent-[#1153e7] focus:ring-[#1153e7]"
              />
              <span className="text-sm text-gray-700">Enable</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="canPost"
                value="disable"
                checked={formData.canPost === 'disable'}
                onChange={handleChange}
                className="mr-2 accent-[#1153e7] focus:ring-[#1153e7]"
              />
              <span className="text-sm text-gray-700">Disable</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;