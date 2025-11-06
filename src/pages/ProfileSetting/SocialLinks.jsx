import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    vkontakte: '',
    linkedin: '',
    instagram: '',
    youtube: ''
  });
  const [socialData, setSocialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Fetch social links from API
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/social-links`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setSocialData(data.social_links);
          // Map API response to form fields
          setSocialLinks({
            facebook: data.social_links.facebook || '',
            twitter: data.social_links.twitter || '',
            vkontakte: data.social_links.vk || '', // API uses 'vk' but UI shows 'Vkontakte'
            linkedin: data.social_links.linkedin || '',
            instagram: data.social_links.instagram || '',
            youtube: data.social_links.youtube || ''
          });
        } else {
          throw new Error(data.api_text || 'Failed to fetch social links');
        }
      } catch (err) {
        console.error('Error fetching social links:', err);
        setError('Failed to load social links. Please try again.');
        // Set fallback data to maintain UI
        setSocialLinks({
          facebook: '',
          twitter: '',
          vkontakte: '',
          linkedin: '',
          instagram: '',
          youtube: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
    // Clear success message when user makes changes
    if (updateSuccess) {
      setUpdateSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateLoading(true);
      setError(null);
      setUpdateSuccess(false);

      // Prepare API request body (only include non-empty values)
      const apiData = {};
      Object.keys(socialLinks).forEach(key => {
        if (socialLinks[key].trim() !== '') {
          // Convert 'vkontakte' back to 'vk' for API
          const apiKey = key === 'vkontakte' ? 'vk' : key;
          apiData[apiKey] = socialLinks[key].trim();
        }
      });
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/social-links`,
        apiData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
          }
        }
      );

      const data = response.data;
      
      if (data.api_status === '200') {
        setUpdateSuccess(true);
        setSocialData(data.social_links);
        
        // Update form with the response data to ensure consistency
        setSocialLinks({
          facebook: data.social_links.facebook || '',
          twitter: data.social_links.twitter || '',
          vkontakte: data.social_links.vk || '',
          linkedin: data.social_links.linkedin || '',
          instagram: data.social_links.instagram || '',
          youtube: data.social_links.youtube || ''
        });
        
        // Show success message for 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.api_text || 'Failed to update social links');
      }
    } catch (err) {
      console.error('Error updating social links:', err);
      setError('Failed to update social links. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">
        Social Links
      </h2>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading social links...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Row 1: Facebook (full width) */}
            <div>
              <input
                type="url"
                name="facebook"
                value={socialLinks.facebook}
                onChange={handleChange}
                placeholder="Facebook"
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Row 2: Twitter and Vkontakte */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="url"
                  name="twitter"
                  value={socialLinks.twitter}
                  onChange={handleChange}
                  placeholder="Twitter"
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <input
                  type="url"
                  name="vkontakte"
                  value={socialLinks.vkontakte}
                  onChange={handleChange}
                  placeholder="Vkontakte"
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Row 3: Linkedin and Instagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="url"
                  name="linkedin"
                  value={socialLinks.linkedin}
                  onChange={handleChange}
                  placeholder="Linkedin"
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <input
                  type="url"
                  name="instagram"
                  value={socialLinks.instagram}
                  onChange={handleChange}
                  placeholder="Instagram"
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Row 4: YouTube (left aligned) */}
            <div>
              <input
                type="url"
                name="youtube"
                value={socialLinks.youtube}
                onChange={handleChange}
                placeholder="YouTube"
                className="w-full px-3 py-2 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="border-t border-[#d3d1d1] pt-4 mt-3.5 flex justify-end">
            <button 
              type="submit"
              disabled={updateLoading}
              className={`px-6 py-2 border border-purple-500 text-purple-500 bg-white rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold ${
                updateLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-50'
              }`}
            >
              {updateLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500 mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      )}
      
      {updateSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">Social links updated successfully!</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SocialLinks;