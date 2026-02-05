import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const CreateGroupForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    groupName: '',
    groupDescription: '',
    groupType: 'public',
    joinPrivacy: 'public',
    groupCategory: '',
    groupSubCategory: ''
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [privacyOptions, setPrivacyOptions] = useState([]);
  const [joinPrivacyOptions, setJoinPrivacyOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch group meta data (categories and privacy options)
  const fetchGroupMeta = async () => {
    try {
      setLoading(true);
      
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/groups/meta`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (response.data && response.data.ok && response.data.data) {
        const metaData = response.data.data;
        
        // Set categories
        if (metaData.categories) {
          setCategories(metaData.categories);
          // Set default category to first one if available
          if (metaData.categories.length > 0) {
            setFormData(prev => ({
              ...prev,
              groupCategory: metaData.categories[0].id.toString()
            }));
          }
        }
        
        // Set privacy options
        if (metaData.types && metaData.types.privacy) {
          setPrivacyOptions(metaData.types.privacy);
        }
        
        // Set join privacy options
        if (metaData.types && metaData.types.join_privacy) {
          setJoinPrivacyOptions(metaData.types.join_privacy);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching group meta:', err);
      toast.error(err.response?.data?.message || 'Failed to load form options. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories based on selected category
  const fetchSubCategories = async (categoryId) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/groups/meta?category_id=${categoryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (response.data && response.data.ok && response.data.data) {
        setSubCategories(response.data.data.sub_categories || []);
      } else {
        setSubCategories([]);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubCategories([]);
    }
  };

  // Load meta data when component mounts
  useEffect(() => {
    fetchGroupMeta();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.groupName.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    if (!formData.groupCategory) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.groupSubCategory) {
      toast.error('Please select a sub category');
      return;
    }

    try {
      setSubmitting(true);
      
      const accessToken = localStorage.getItem('access_token');
      
      const requestData = {
        group_name: formData.groupName.trim(),
        group_title: formData.groupName.trim(), // Using same as group_name for now
        category: parseInt(formData.groupCategory),
        sub_category: parseInt(formData.groupSubCategory),
        privacy: formData.groupType,
        join_privacy: formData.joinPrivacy
      };

      // Add description if provided
      if (formData.groupDescription.trim()) {
        requestData.about = formData.groupDescription.trim();
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/groups`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (response.data && response.data.ok === true) {
        setSubmitSuccess(true);
        toast.success('Group created successfully!');
        console.log('Group created successfully:', response.data);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        // Reset form after successful creation
        setTimeout(() => {
          setFormData({
            groupName: '',
            groupDescription: '',
            groupType: 'public',
            joinPrivacy: 'public',
            groupCategory: categories.length > 0 ? categories[0].id.toString() : '',
            groupSubCategory: ''
          });
          setSubCategories([]);
          setSubmitSuccess(false);
          
          // Close modal after success
          if (onClose) {
            onClose();
          }
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to create group');
      }
    } catch (err) {
      console.error('Error creating group:', err);
      // Handle errors array from response
      if (err.response?.data?.api_status === 400 && err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Display each error from the errors array
        err.response.data.errors.forEach((errorMsg) => {
          toast.error(errorMsg);
        });
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message || 'Failed to create group. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading form options...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen  flex items-center justify-center relative ">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl ">
        {/* Header with Wave Pattern */}
        <div className="relative  h-64 flex items-start justify-end px-8 md:px-16">
        {onClose && (
            <button
              onClick={onClose}
              className="z-10 absolute flex -right-2 -top-2 w-10 h-10 items-center justify-center cursor-pointer text-gray-600 bg-gray-100 rounded-full transition-colors"
            >
                
              <FiX className="w-6 h-6" />
            </button>
          )}
          {/* Wave SVG */}
       <img src="/Vectorgroup.svg" alt="vector" className='absolute bottom-0 right-0 top-0 w-full' />
          <h1 className="text-xl md:text-2xl font-bold text-white z-10 pt-6">
            Create Group
          </h1>
        </div>

        {/* Form */}
        <div className="p-8 md:p-12 space-y-6">
          {/* Group Name */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-gray-600 font-medium">
              Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              placeholder="Group Name"
              className="w-full p-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
            />
          </div>

          {/* Group Description */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-gray-600 font-medium">
              Group Description
            </label>
            <textarea
              name="groupDescription"
              value={formData.groupDescription}
              onChange={handleChange}
              placeholder="Group Description"
              rows={5}
              className="w-full p-3 px-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
            />
          </div>

          {/* Group Type */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-gray-600 font-medium">
              Group type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="groupType"
                value={formData.groupType}
                onChange={handleChange}
                className="w-full p-3 px-4 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
              >
                {privacyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
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
            <label className="text-base text-gray-600 font-medium">
              Join Privacy <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="joinPrivacy"
                value={formData.joinPrivacy}
                onChange={handleChange}
                className="w-full p-3 px-4 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
              >
                {joinPrivacyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
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

          {/* Group Category */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-gray-600 font-medium">
              Group Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="groupCategory"
                value={formData.groupCategory}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    groupCategory: selectedId,
                    groupSubCategory: '' // Reset subcategory when category changes
                  }));
                  // Fetch subcategories
                  if (selectedId) {
                    fetchSubCategories(selectedId);
                  } else {
                    setSubCategories([]);
                  }
                }}
                className="w-full p-3 px-4 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
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

          {/* Group Sub Category */}
          <div className="flex flex-col gap-2">
            <label className="text-base text-gray-600 font-medium">
              Sub Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="groupSubCategory"
                value={formData.groupSubCategory}
                onChange={handleChange}
                disabled={!formData.groupCategory || subCategories.length === 0}
                className="w-full p-3 px-4 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select sub category</option>
                {subCategories.map((subCategory) => (
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

          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600 text-center font-semibold">
                ✅ Group created successfully!
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`w-[16rem] md:w-[15rem] h-[50px] font-semibold text-[15px] md:text-[18px] rounded-lg transition-all duration-300 ${
                submitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : submitSuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </div>
              ) : submitSuccess ? (
                'Group Created!'
              ) : (
                'Publish Group'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupForm;