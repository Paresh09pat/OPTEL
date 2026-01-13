import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/loading/Loader';
import { baseUrl } from '../../utils/constant';
import { HiUsers } from 'react-icons/hi';
import { toast } from 'react-toastify';

const PageDetailed = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(null);

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
        if (!res.ok) {
          throw new Error(data?.message || 'Failed to fetch page');
        }

        // The API shape may vary; keep it flexible.
        setPage(data?.data || data);
      } catch (e) {
        setError(e?.message || 'Failed to fetch page');
        toast.error(e?.message || 'Failed to fetch page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [pageId, accessToken]);

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

  const pageName = page.page_name || page.name || page.page_title || 'Unnamed Page';
  const avatarUrl =
    page.avatar_url ||
    page.avatar ||
    page.page_avatar ||
    'https://66.116.199.195/images/placeholders/user-avatar.svg';
  const coverUrl = page.cover_url || page.cover || page.page_cover || null;
  const categoryName = page.category_name || page.category || page.page_category || null;
  const about = page.about || page.page_description || page.description || null;
  const followersCount = page.followers_count || page.likes_count || page.likes || page.page_likes || null;

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
          {coverUrl ? (
            <img src={coverUrl} alt={pageName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-6xl">📄</span>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
              <img src={avatarUrl} alt={pageName} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageName}</h1>
              {categoryName && <p className="text-lg text-gray-600 mb-3">{categoryName}</p>}

              <div className="flex items-center gap-6 flex-wrap">
                {followersCount !== null && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <HiUsers className="w-5 h-5 text-[#3D8CFA]" />
                    <span className="font-semibold">{followersCount} Followers</span>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Page Button (only for page owner) */}
            {page.is_owner && (
              <div className="w-full md:w-auto">
                <button
                  onClick={() => navigate(`/page/${pageId}/settings`)}
                  className="w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Edit Page
                </button>
              </div>
            )}
          </div>
        </div>

        {about && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {String(about).replace(/<br\s*\/?>/gi, '\n')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageDetailed;

