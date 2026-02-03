// PageManagementSystem.js
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

// Import all components
import { MenuIcon, XIcon } from 'lucide-react';
import { FiSettings } from 'react-icons/fi';
import { GoLink } from "react-icons/go";
import { MdOutlineAddPhotoAlternate, MdOutlineDelete } from "react-icons/md";
import { RiShieldUserLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import Loader from '../../components/loading/Loader';
import { baseUrl } from '../../utils/constant';
import Admin from './Admin';
import DeletePage from './DeletePage';
import Design from './Design';
import GeneralSettings from './GeneralSettings';
import PageAnalytics from './PageAnalytics';
import PageInformation from './PageInformation';
import ProfilePictureAndCover from './ProfilePictureAndCover';
import SocialLinks from './SocialLinks';

const MainPageSetting = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState('general-setting');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState({ avatar: null, cover: null });
  
  // Unified form data for all settings
  const [formData, setFormData] = useState({
    // General Settings
    pageName: '',
    category: '',
    subCategory: '',
    callToAction: '',
    callToTargetUrl: '',
    pageUrl: '',
    canPost: 'disable',
    // Page Information
    companyName: '',
    phone: '',
    location: '',
    websiteUrl: '',
    about: '',
    // Social Links
    facebook: '',
    twitter: '',
    instagram: '',
    vkontakte: '',
    linkedin: '',
    youtube: ''
  });
  const pageIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M14 4.57a.5.5 0 0 0-.024-.235l-.013-.063a1.5 1.5 0 0 0-.18-.434c-.092-.15-.222-.28-.482-.54l-2.59-2.59c-.259-.26-.389-.39-.54-.483a1.5 1.5 0 0 0-.496-.193a.5.5 0 0 0-.235-.024C9.329.004 9.194.004 9.015.004h-2.21c-1.68 0-2.52 0-3.16.327a3.02 3.02 0 0 0-1.31 1.31c-.327.642-.327 1.48-.327 3.16v6.4c0 1.68 0 2.52.327 3.16a3.02 3.02 0 0 0 1.31 1.31c.642.327 1.48.327 3.16.327h2.4c1.68 0 2.52 0 3.16-.327a3 3 0 0 0 1.31-1.31c.327-.642.327-1.48.327-3.16V4.99c0-.178 0-.313-.005-.425zm-4.8 10.4H6.8c-.857 0-1.44 0-1.89-.038c-.438-.035-.663-.1-.819-.18a2 2 0 0 1-.874-.874c-.08-.156-.145-.38-.18-.819c-.037-.45-.038-1.03-.038-1.89v-6.4c0-.857.001-1.44.038-1.89c.036-.438.101-.663.18-.819c.192-.376.498-.682.874-.874c.156-.08.381-.145.819-.18C5.36.97 5.94.97 6.8.97H9v3.5a.5.5 0 0 0 .5.5H13v6.2c0 .857 0 1.44-.038 1.89c-.035.438-.1.663-.18.819a2 2 0 0 1-.874.874c-.156.08-.38.145-.819.18c-.45.037-1.03.037-1.89.037zm.8-13.6l2.59 2.59H10z" clipRule="evenodd"></path></svg>
    )
  }
  const profileIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 14 14"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5v2a1 1 0 0 1-1 1h-2m0-13h2a1 1 0 0 1 1 1v2m-13 0v-2a1 1 0 0 1 1-1h2m0 13h-2a1 1 0 0 1-1-1v-2m6.5-4a2 2 0 1 0 0-4a2 2 0 0 0 0 4m3.803 4.5a3.994 3.994 0 0 0-7.606 0z" strokeWidth={1}></path></svg>
    )
  }
  const designIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 16 16"><path fill="currentColor" d="M3.58 1.125a.5.5 0 0 1 .12.598a.3.3 0 0 0-.013.09c0 .063.016.183.167.333c.073.073.129.125.19.182c.05.046.103.094.17.16c.13.124.267.27.39.453c.255.383.396.862.396 1.559c0 .382-.063.74-.178 1.057C4.496 6.457 3.763 7 3 7s-1.496-.544-1.822-1.443A3.1 3.1 0 0 1 1 4.5c0-.326.087-.715.207-1.074s.288-.732.482-1.032c.231-.39.556-.717.808-.937a6 6 0 0 1 .432-.343l.03-.02l.009-.007l.003-.002l.002-.001a.5.5 0 0 1 .608.041M3 8a2.7 2.7 0 0 0 1.738-.628q.03.094.057.19C5 8.314 5 9.244 5 9.963V10c0 2.058-.385 3.28-.821 4.007a2.7 2.7 0 0 1-.638.747a1.7 1.7 0 0 1-.33.2S3.084 15 3 15a.8.8 0 0 1-.211-.046a1.7 1.7 0 0 1-.33-.2a2.7 2.7 0 0 1-.638-.747C1.385 13.281 1 12.058 1 10v-.036c0-.72 0-1.649.205-2.403q.026-.094.057-.19A2.7 2.7 0 0 0 3 8.002m3.998 2.973a4.5 4.5 0 0 1-1.016-.235Q6 10.362 6 9.96v-.296c.31.147.646.25.998.3V8a2 2 0 0 1 2-2h1.965a3.5 3.5 0 0 0-5.075-2.609a3.2 3.2 0 0 0-.384-.926A4.5 4.5 0 0 1 11.97 6h1.027a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2zM11.971 7a4.5 4.5 0 0 1-3.973 3.973V12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-1.008 0H8.998a1 1 0 0 0-1 1v1.965A3.5 3.5 0 0 0 10.963 7"></path></svg>
    )
  }
  const analyticsIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}><path strokeLinejoin="round" d="m7 14l2.293-2.293a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 0 1.414 0L17 10m0 0v2.5m0-2.5h-2.5"></path><path d="M22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12s0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464c.974.974 1.3 2.343 1.41 4.536"></path></g></svg>
    )
  }
  // Fetch page data
  const fetchPageData = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('access_token');
      
      const response = await axios.get(`${baseUrl}/api/v1/pages/${pageId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Page data response:', response.data);

      if (response.data.api_status === 200 && response.data.data) {
        const data = response.data.data;
        setPageData(data);
        
        // Initialize unified form data with proper mapping
        setFormData({
          // General Settings
          pageName: data.page_name || '',
          category: String(data.category || ''),
          subCategory: data.sub_category || '',
          callToAction: data.call_to_action || '',
          callToTargetUrl: data.call_to_target_url || '',
          pageUrl: data.url || data.website || '',
          canPost: data.can_post || 'disable',
          // Page Information
          companyName: data.page_title || '',
          phone: data.phone || '',
          location: data.address || '',
          websiteUrl: data.website || '',
          about: data.about || '',
          // Social Links
          facebook: data.facebook || '',
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          vkontakte: data.vkontakte || '',
          linkedin: data.linkedin || '',
          youtube: data.youtube || ''
        });
      } else {
        setError('Failed to load page data');
        toast.error('Failed to load page data');
      }
    } catch (err) {
      console.error('Error fetching page data:', err);
      setError(err.message);
      toast.error('Error loading page data');
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image changes from ProfilePictureAndCover component
  const handleImageChange = (type, file) => {
    console.log('handleImageChange called:', type, file);
    setSelectedImages(prev => {
      const updated = { ...prev, [type]: file };
      console.log('Updated selectedImages:', updated);
      return updated;
    });
  };

  // Save all changes
  const handleSaveAll = async () => {
    try {
      // Validate required fields
      if (!formData.phone || formData.phone.trim() === '') {
        toast.error('Phone number is required');
        return;
      }

      if (formData.phone.length !== 10) {
        toast.error('Phone number must be exactly 10 digits');
        return;
      }

      if (!formData.location || formData.location.trim() === '') {
        toast.error('Location is required');
        return;
      }

      setSaving(true);
      const accessToken = localStorage.getItem('access_token');
      
      // Check if we have images to upload
      const hasImages = selectedImages.avatar || selectedImages.cover;
      
      if (hasImages) {
        // If images are selected, use FormData for multipart upload
        const formDataToSend = new FormData();
        
        // Add all text fields
        formDataToSend.append('page_name', formData.pageName);
        formDataToSend.append('page_title', formData.companyName);
        formDataToSend.append('page_description', formData.about);
        formDataToSend.append('about', formData.about);
        formDataToSend.append('website', formData.websiteUrl);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('address', formData.location);
        
        // Add page_category only if it's a valid number
        if (formData.category && !isNaN(parseInt(formData.category))) {
          formDataToSend.append('page_category', parseInt(formData.category));
        }
        
        // Add sub_category as integer if it exists
        if (formData.subCategory && !isNaN(parseInt(formData.subCategory))) {
          formDataToSend.append('sub_category', parseInt(formData.subCategory));
        }
        
        // Add optional fields only if they exist
        if (formData.callToAction) formDataToSend.append('call_to_action', formData.callToAction);
        if (formData.callToTargetUrl) formDataToSend.append('call_to_target_url', formData.callToTargetUrl);
        if (formData.canPost) formDataToSend.append('can_post', formData.canPost);
        
        // Add social links if they exist
        if (formData.facebook) formDataToSend.append('facebook', formData.facebook);
        if (formData.twitter) formDataToSend.append('twitter', formData.twitter);
        if (formData.instagram) formDataToSend.append('instagram', formData.instagram);
        if (formData.vkontakte) formDataToSend.append('vkontakte', formData.vkontakte);
        if (formData.linkedin) formDataToSend.append('linkedin', formData.linkedin);
        if (formData.youtube) formDataToSend.append('youtube', formData.youtube);
        
        // Add images if selected
        if (selectedImages.avatar) {
          formDataToSend.append('avatar', selectedImages.avatar);
        }
        if (selectedImages.cover) {
          formDataToSend.append('cover', selectedImages.cover);
        }
        
        console.log('Saving page data with images');
        
        const response = await axios.put(
          `${baseUrl}/api/v1/pages/${pageId}`,
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        console.log('Update response:', response.data);
        
        if (response.data.api_status === 200 || response.data.ok === true) {
          toast.success('Page updated successfully!');
          // Clear selected images after successful upload
          setSelectedImages({ avatar: null, cover: null });
          // Refresh page data to show updated values
          await fetchPageData();
        } else {
          toast.error(response.data.message || 'Failed to update page');
        }
      } else {
        // No images, use regular JSON request
        const updateData = {
          page_name: formData.pageName,
          page_title: formData.companyName,
          page_description: formData.about,
          about: formData.about,
          website: formData.websiteUrl,
          phone: formData.phone,
          address: formData.location,
        };

        // Add page_category only if it's a valid number
        if (formData.category && !isNaN(parseInt(formData.category))) {
          updateData.page_category = parseInt(formData.category);
        }

        // Add sub_category as integer if it exists
        if (formData.subCategory && !isNaN(parseInt(formData.subCategory))) {
          updateData.sub_category = parseInt(formData.subCategory);
        }
        
        // Add optional fields only if they exist
        if (formData.callToAction) updateData.call_to_action = formData.callToAction;
        if (formData.callToTargetUrl) updateData.call_to_target_url = formData.callToTargetUrl;
        if (formData.canPost) updateData.can_post = formData.canPost;
        
        // Add social links if they exist
        if (formData.facebook) updateData.facebook = formData.facebook;
        if (formData.twitter) updateData.twitter = formData.twitter;
        if (formData.instagram) updateData.instagram = formData.instagram;
        if (formData.vkontakte) updateData.vkontakte = formData.vkontakte;
        if (formData.linkedin) updateData.linkedin = formData.linkedin;
        if (formData.youtube) updateData.youtube = formData.youtube;

        console.log('Saving page data:', updateData);
        
        const response = await axios.put(
          `${baseUrl}/api/v1/pages/${pageId}`,
          updateData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Update response:', response.data);

        if (response.data.api_status === 200 || response.data.ok === true) {
          toast.success('Page updated successfully!');
          // Refresh page data to show updated values
          await fetchPageData();
        } else {
          toast.error(response.data.message || 'Failed to update page');
        }
      }
    } catch (err) {
      console.error('Error updating page:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Error updating page';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);

  const menuItems = [
    { id: 'general-setting', label: 'General Setting', icon: FiSettings },
    { id: 'page-information', label: 'Page Information', icon: pageIcon },
    { id: 'social-links', label: 'Social Links', icon: GoLink },
    { id: 'profile-picture-cover', label: 'Profile Picture & Cover', icon: profileIcon },
    { id: 'design', label: 'Design', icon: designIcon },
    { id: 'admin', label: 'Admin', icon: RiShieldUserLine },
    { id: 'page-analytics', label: 'Page Analytics', icon: analyticsIcon },
    { id: 'delete-page', label: 'Delete Page', icon: MdOutlineDelete },
  ];

  const renderActiveComponent = () => {
    if (!pageData) return null;

    switch (activeMenuItem) {
      case 'general-setting':
        return <GeneralSettings formData={formData} handleChange={handleChange} />;
      case 'page-information':
        return <PageInformation formData={formData} handleChange={handleChange} />;
      case 'social-links':
        return <SocialLinks formData={formData} handleChange={handleChange} />;
      case 'profile-picture-cover':
        return <ProfilePictureAndCover pageData={pageData} onImageChange={handleImageChange} />;
      case 'design':
        return <Design pageData={pageData} />;
      case 'admin':
        return <Admin pageData={pageData} />;
      case 'page-analytics':
        return <PageAnalytics pageData={pageData} />;
      case 'delete-page':
        return <DeletePage pageData={pageData} pageId={pageId} />;
      default:
        return <GeneralSettings formData={formData} handleChange={handleChange} />;
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error || 'Page not found'}</p>
          <button
            onClick={() => navigate('/pagescomp/mainpages')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Pages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9] pt-8 overflow-x-hidden pb-8">
      <div className="max-w-6xl mx-auto relative">

        {/* main header */}
        <div className="flex justify-between items-center flex-wrap gap-4 pb-8">
          <h1 className="text-xl sm:text-3xl lg:text-3xl font-bold text-gray-800">
            Page Setting
          </h1>
          <Link to="/pagescomp/mainpages">

            <button className="text-[#808080] flex items-center gap-2 border border-[#808080] px-4 py-2 rounded-full text-sm sm:text-base hover:bg-gray-50 transition">
              <MdOutlineAddPhotoAlternate className="text-lg" />
              <span>Create Page</span>
            </button>
          </Link>

        </div>


        {/* Header */}
        <div className="bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] rounded-xl p-4 h-[200px] py-5 px-8 relative">
        <img src="/profilebg.svg" alt="profile bg" className='absolute bottom-0 right-0  w-1/4' />
          <div className="flex items-center gap-5">
            <div className="size-[74px] bg-gray-800 rounded-full flex items-center justify-center" style={{ backgroundImage: `url('${pageData?.avatar_url || '/perimg.png'}')`, backgroundSize: "cover", backgroundPosition: "center" }}>

            </div>
            <div>
              <h1 className="text-white text-xl font-semibold">
                {pageData?.page_name || pageData?.page_title || 'Page Name'} 
                {pageData?.verified && ' ✓'}
              </h1>
              <p className="text-orange-100 text-sm">
                Category : {pageData?.category_name || pageData?.category || 'N/A'}
              </p>
            </div>
          </div>
          <div className='absolute top-8 right-6 block md:hidden text-white cursor-pointer font-semibold z-50'>
            <button className=' ' onClick={() => setIsMenuOpen(!isMenuOpen)} >
              {isMenuOpen ? <XIcon className='size-7' /> : <MenuIcon className='size-7' />}
            </button>
          </div>
          <div className={`overlay ${isMenuOpen ? 'block' : 'hidden'} bg-black/50 absolute top-0 left-0 w-full min-h-screen z-40`} onClick={() => setIsMenuOpen(false)}></div>
          <div className={`w-64 z-50 overflow-hidden block md:hidden bg-white rounded-xl pt-1.5  mx-2 border border-[#808080] absolute top-16 -right-10 ${isMenuOpen ? '-translate-x-9' : 'translate-x-full'} transition-transform duration-300`}>
            <h3 className="text-[#808080] font-medium  text-xl text-center">Menu</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm  transition-colors ${activeMenuItem === item.id
                      ? 'bg-gradient-to-r from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="size-[19px]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>


        </div>

        {/* Main Content */}
        <div className="rounded-b-lg flex min-h-[600px] -mt-20">
          {/* Sidebar Menu */}
          <div className="w-64 flex-shrink-0 hidden md:block overflow-hidden h-full bg-white rounded-xl pt-1.5 mx-2 border border-[#808080] relative">
            <h3 className="text-[#808080] font-medium text-xl text-center">Menu</h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm transition-colors ${activeMenuItem === item.id
                      ? 'bg-gradient-to-r from-[rgba(17,83,231,1)] to-[rgba(96,161,249,1)] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <Icon className="size-[19px]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0 pl-1 pr-2 relative">
            {renderActiveComponent()}
            
            {/* Single Save Button - Always Visible */}
            <div className="mt-6 flex justify-center sticky bottom-4 z-20">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageSetting;