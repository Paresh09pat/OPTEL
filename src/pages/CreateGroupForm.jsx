import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiX } from 'react-icons/fi';
import axios from 'axios';

const CreateGroupForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    groupName: '',
    groupDescription: '',
    groupUrl: 'https://ouptel.com/',
    groupType: 'public',
    joinPrivacy: 'public',
    groupCategory: ''
  });

  const [categories, setCategories] = useState([]);
  const [privacyOptions, setPrivacyOptions] = useState([]);
  const [joinPrivacyOptions, setJoinPrivacyOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch group meta data (categories and privacy options)
  const fetchGroupMeta = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      setError('Failed to load form options. Please try again.');
    } finally {
      setLoading(false);
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
      setError('Group name is required');
      return;
    }
    
    if (!formData.groupCategory) {
      setError('Please select a category');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const accessToken = localStorage.getItem('access_token');
      
      const requestData = {
        group_name: formData.groupName.trim(),
        group_title: formData.groupName.trim(), // Using same as group_name for now
        category: parseInt(formData.groupCategory),
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
            groupUrl: 'https://ouptel.com/',
            groupType: 'public',
            joinPrivacy: 'public',
            groupCategory: categories.length > 0 ? categories[0].id.toString() : ''
          });
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
      setError(err.response?.data?.message || err.message || 'Failed to create group. Please try again.');
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
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
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

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchGroupMeta}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
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
        <div className="p-8 md:p-12 space-y-8">
          {/* Group Name */}
          <div className="space-y-3">
            <label className="text-xl font-semibold text-gray-900 flex items-center gap-1">
              Group Name : <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              placeholder="Group Name"
              className="w-full px-6 py-4 text-lg border-2 border-gray-900 rounded-full focus:outline-none focus:border-blue-600 transition-colors placeholder-gray-400"
            />
          </div>

          {/* Group Description */}
          <div className="space-y-3">
            <label className="text-xl font-semibold text-gray-900">
              Group Description :
            </label>
            <textarea
              name="groupDescription"
              value={formData.groupDescription}
              onChange={handleChange}
              placeholder="Group Description"
              rows={5}
              className="w-full px-6 py-4 text-lg border-2 border-gray-900 rounded-3xl focus:outline-none focus:border-blue-600 transition-colors resize-none placeholder-gray-400"
            />
          </div>

          {/* Group URL */}
          <div className="space-y-3">
            <label className="text-xl font-semibold text-gray-900 flex items-center gap-1">
              Group URL : <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="groupUrl"
              value={formData.groupUrl}
              onChange={handleChange}
              placeholder="https://ouptel.com/"
              className="w-full px-6 py-4 text-lg border-2 border-gray-900 rounded-full focus:outline-none focus:border-blue-600 transition-colors placeholder-gray-400"
            />
          </div>

          {/* Group Type */}
          <div className="space-y-3">
            <label className="text-xl font-semibold text-gray-900 flex items-center gap-1">
              Group type : <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="groupType"
                value={formData.groupType}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-900 rounded-full focus:outline-none focus:border-blue-600 transition-colors appearance-none bg-white text-gray-700 cursor-pointer"
              >
                {privacyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Join Privacy */}
          <div className="space-y-3">
            <label className="text-xl font-semibold text-gray-900 flex items-center gap-1">
              Join Privacy : <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="joinPrivacy"
                value={formData.joinPrivacy}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-900 rounded-full focus:outline-none focus:border-blue-600 transition-colors appearance-none bg-white text-gray-700 cursor-pointer"
              >
                {joinPrivacyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Group Category */}
          <div className="space-y-3">
            <label className="text-xl font-semibold text-gray-900 flex items-center gap-1">
              Group Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="groupCategory"
                value={formData.groupCategory}
                onChange={handleChange}
                className="w-full px-6 py-4 text-lg border-2 border-gray-900 rounded-full focus:outline-none focus:border-blue-600 transition-colors appearance-none bg-white text-gray-700 cursor-pointer"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-center">{error}</p>
            </div>
          )}

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
              className={`px-32 py-4 text-2xl font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                submitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : submitSuccess
                  ? 'bg-green-600 text-white border-3 border-green-600'
                  : 'text-blue-600 bg-white border-3 border-blue-600 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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