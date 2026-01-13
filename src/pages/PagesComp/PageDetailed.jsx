import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/loading/Loader';
import { baseUrl } from '../../utils/constant';
import { HiUsers } from 'react-icons/hi';
import { FaHeart, FaRegHeart, FaGlobe, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';

const DEFAULT_AVATAR = 'https://admin.ouptel.in/images/placeholders/page-avatar.svg';
const DEFAULT_USER_AVATAR = 'https://admin.ouptel.in/images/placeholders/user-avatar.svg';

const PageDetailed = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);
  const [liking, setLiking] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [ownerAvatarError, setOwnerAvatarError] = useState(false);

  const accessToken = useMemo(() => localStorage.getItem('access_token'), []);

  useEffect(() => {
    const fetchPage = async () => {
      if (!pageId) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${baseUrl}/api/v1/pages/${pageId}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });

        const data = await res.json().catch(() => null);
        console.log('Page API response:', data);
        
        if (!res.ok || data?.api_status !== 200) {
          throw new Error(data?.message || 'Failed to fetch page');
        }

        setPage(data?.data);
      } catch (e) {
        setError(e?.message || 'Failed to fetch page');
        toast.error(e?.message || 'Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId, accessToken]);

  const handleLikePage = async () => {
    if (!page) return;
    setLiking(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/pages/like`,
        { page_id: parseInt(pageId) },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data?.api_status === 200 || response.data?.ok === true) {
        const isNowLiked = !page.is_liked;
        setPage(prev => ({
          ...prev,
          is_liked: isNowLiked,
          likes_count: isNowLiked ? (prev.likes_count || 0) + 1 : Math.max(0, (prev.likes_count || 0) - 1)
        }));
        toast.success(isNowLiked ? 'Page liked successfully' : 'Page unliked');
      } else {
        toast.error(response.data?.message || 'Failed to update like status');
      }
    } catch (error) {
      console.error('Error liking page:', error);
      toast.error(error.response?.data?.message || 'Failed to update like status');
    } finally {
      setLiking(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Page not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9]">
      {/* Header */}
      <div className="w-full sticky top-0 z-10 bg-[#EDF6F9] pt-8 pb-4 px-4 md:px-7">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Cover */}
        <div className="w-full h-64 md:h-80 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl overflow-hidden mb-6 shadow-lg">
          {page.cover_url && !coverError ? (
            <img 
              src={page.cover_url} 
              alt={page.page_title} 
              className="w-full h-full object-cover"
              onError={() => setCoverError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-6xl">📄</span>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0 border-4 border-white bg-gray-100">
              {!avatarError ? (
                <img 
                  src={page.avatar_url || page.avatar || DEFAULT_AVATAR} 
                  alt={page.page_title} 
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span className="text-4xl">📄</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{page.page_title}</h1>
                {page.verified && (
                  <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-gray-500 mb-2">@{page.page_name}</p>
              {page.category_name && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium mb-3">
                  {page.category_name}
                </span>
              )}

              <div className="flex items-center gap-6 flex-wrap text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <HiUsers className="w-5 h-5 text-[#3D8CFA]" />
                  <span className="font-semibold">{page.likes_count || 0} Likes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-5 h-5 text-[#3D8CFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span className="font-semibold">{page.posts_count || 0} Posts</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              {/* Like/Unlike Button */}
              <button
                onClick={handleLikePage}
                disabled={liking}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 ${
                  page.is_liked
                    ? 'bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100'
                    : 'bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100'
                }`}
              >
                {liking ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : page.is_liked ? (
                  <FaHeart className="w-5 h-5" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
                <span>{page.is_liked ? 'Liked' : 'Like Page'}</span>
              </button>

              {/* Edit Page Button (only for page owner) */}
              {page.is_owner && (
                <button
                  onClick={() => navigate(`/page/${pageId}/settings`)}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <MdEdit className="w-5 h-5" />
                  <span>Edit Page</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        {(page.about || page.page_description) && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {page.about || page.page_description}
            </p>
          </div>
        )}

        {/* Contact & Info Section */}
        {(page.website || page.phone || page.address) && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              {page.website && (
                <a 
                  href={page.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaGlobe className="w-5 h-5 text-blue-500" />
                  <span className="break-all">{page.website}</span>
                </a>
              )}
              {page.phone && (
                <a 
                  href={`tel:${page.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FaPhone className="w-5 h-5 text-green-500" />
                  <span>{page.phone}</span>
                </a>
              )}
              {page.address && (
                <div className="flex items-start gap-3 text-gray-700">
                  <FaMapMarkerAlt className="w-5 h-5 text-red-500 mt-0.5" />
                  <span>{page.address}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Owner Section */}
        {page.owner && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Page Owner</h2>
            <div 
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors -m-3"
              onClick={() => navigate(`/profile/${page.owner.user_id}`)}
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                {!ownerAvatarError ? (
                  <img 
                    src={page.owner.avatar_url || page.owner.avatar || DEFAULT_USER_AVATAR} 
                    alt={page.owner.name}
                    className="w-full h-full object-cover"
                    onError={() => setOwnerAvatarError(true)}
                  />
                ) : (
                  <span className="text-2xl">👤</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{page.owner.name}</h3>
                  {page.owner.verified && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-500 text-sm">@{page.owner.username}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageDetailed;

