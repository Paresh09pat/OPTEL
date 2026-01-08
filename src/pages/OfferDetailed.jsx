import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';
import { baseUrl } from '../utils/constant';
import Loader from '../components/loading/Loader';
import Avatar from '../components/Avatar';
import axios from 'axios';
import { toast } from 'react-toastify';

const OfferDetailed = () => {
  const { offerId } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const accessToken = localStorage.getItem('access_token');

  const getOffer = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/offers/${offerId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const responseData = response.data;
      console.log(responseData, 'offer-detailed');
      
      if (responseData.ok && responseData.data) {
        const offerData = responseData.data.offer;
        setOffer(offerData);
        setApplications(responseData.data.applications || []);
      } else {
        throw new Error(responseData.message || 'Failed to fetch offer');
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (offerId) {
      getOffer();
    }
  }, [offerId]);

  const handleApply = async () => {
    if (!offer || offer.is_applied) return;
    
    setApplying(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/offers/${offerId}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.ok || response.data?.api_status === 200) {
        toast.success('Application submitted successfully!');
        setOffer(prev => ({ ...prev, is_applied: true, applications_count: (prev.applications_count || 0) + 1 }));
      } else {
        toast.error(response.data?.message || 'Failed to apply');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply to offer');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => navigate('/offers')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Offers
          </button>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Offer not found</p>
          <button
            onClick={() => navigate('/offers')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Offers
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div className="min-h-screen bg-[#EDF6F9]">
        {/* Header with Back Button */}
        <div className="w-full sticky top-0 z-10 bg-[#EDF6F9] pt-8 pb-4 px-4 md:px-7">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate('/offers')}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors mb-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Back to Offers</span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pb-8">
          {/* Offer Header Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl flex-shrink-0">
                🎁
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {offer.title}
                </h1>
                {offer.status && (
                  <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                    offer.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {offer.status}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Price */}
              {offer.price !== null && offer.price !== undefined && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-2">
                    <FiDollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600 text-center mb-1">Price</p>
                  <p className="text-sm lg:text-base text-gray-900 font-semibold text-center">
                    {offer.price > 0 
                      ? `${offer.currency || 'USD'} ${offer.price.toLocaleString()}` 
                      : 'Free'}
                  </p>
                </div>
              )}

              {/* Location */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
                  <FiMapPin className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 text-center mb-1">Location</p>
                <p className="text-sm lg:text-base text-gray-900 font-semibold text-center truncate">
                  {offer.location || 'Not specified'}
                </p>
              </div>

              {/* Created Date */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mb-2">
                  <FiClock className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 text-center mb-1">Created</p>
                <p className="text-sm lg:text-base text-gray-900 font-semibold text-center">
                  {offer.created_at ? formatDate(offer.created_at) : 'N/A'}
                </p>
              </div>

              {/* Applications Count */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mb-2">
                  <FiUser className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-xs text-gray-600 text-center mb-1">Applications</p>
                <p className="text-sm lg:text-base text-gray-900 font-semibold text-center">
                  {offer.applications_count || 0}
                </p>
              </div>
            </div>

            {/* Description */}
            {offer.description && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {offer.description}
                </p>
              </div>
            )}

            {/* Owner Section */}
            {offer.owner && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <Avatar
                  src={offer.owner.avatar_url}
                  name={offer.owner.username || 'Unknown'}
                  size="md"
                />
                <div>
                  <p className="text-sm text-gray-500">Posted by</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {offer.owner.username || 'Unknown'}
                  </p>
                </div>
              </div>
            )}

            {/* Apply Button */}
            {!offer.is_owner && (
              <button
                onClick={handleApply}
                disabled={offer.is_applied || applying}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                  offer.is_applied
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {applying ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Applying...
                  </span>
                ) : offer.is_applied ? (
                  'Already Applied'
                ) : (
                  'Apply to Offer'
                )}
              </button>
            )}

            {offer.is_owner && (
              <div className="w-full py-3 px-6 rounded-lg font-semibold text-center bg-blue-100 text-blue-700">
                You are the owner of this offer
              </div>
            )}
          </div>

          {/* Applications Section */}
          {offer.is_owner && applications.length > 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Applications ({applications.length})</h2>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={application.user?.avatar_url}
                        name={application.user?.username || 'Unknown'}
                        size="sm"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {application.user?.username || 'Unknown'}
                        </p>
                        {application.created_at && (
                          <p className="text-sm text-gray-500">
                            Applied on {formatDate(application.created_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {offer.is_owner && applications.length === 0 && (
            <div className="bg-white rounded-2xl shadow-md p-6 text-center">
              <p className="text-gray-500">No applications yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OfferDetailed;
