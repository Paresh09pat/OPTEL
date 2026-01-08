import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { baseUrl } from '../utils/constant';
import Loader from '../components/loading/Loader';

const Offers = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async (page = 1) => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const response = await axios.get(`${baseUrl}/api/v1/offers?type=all&per_page=12&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.data?.data) {
        if (page === 1) {
          setOffers(response.data.data);
        } else {
          setOffers(prev => [...prev, ...response.data.data]);
        }
        setPagination(response.data.meta || null);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (pagination && pagination.current_page < pagination.last_page && !loadingMore) {
      fetchOffers(pagination.current_page + 1);
    }
  };

  const filteredOffers = offers.filter(offer =>
    offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
          
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Offers</h2>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-2 md:px-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for offers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                </div>
                <button className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                  <FiFilter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Offers List */}
          <div className="px-2 md:px-4">
            {loading && offers.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-lg">No offers available</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredOffers.map((offer) => (
                    <div
                      key={offer.id}
                      onClick={() => navigate(`/offers/${offer.id}`)}
                      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col h-full group"
                    >
                      {/* Image Section */}
                      <div className="relative w-full h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 overflow-hidden">
                        {offer.image_url ? (
                          <img
                            src={offer.image_url}
                            alt={offer.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl mb-2">🎁</div>
                            </div>
                          </div>
                        )}
                        
                        {/* Status Badge Overlay */}
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow-md ${
                            offer.status === 'active' 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-500 text-white'
                          }`}>
                            {offer.status === 'active' ? 'Active' : offer.status}
                          </span>
                        </div>
                      </div>

                      {/* Content Section - Minimal Info */}
                      <div className="p-4 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {offer.title}
                        </h3>

                        {/* Price */}
                        {offer.price !== null && offer.price !== undefined && offer.price > 0 && (
                          <div className="mb-3">
                            <span className="text-2xl font-bold text-blue-600">
                              {offer.currency || 'USD'} {offer.price.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {/* View Details Text */}
                        <div className="mt-auto pt-3 border-t border-gray-100">
                          <span className="text-sm text-blue-600 font-medium group-hover:underline">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Info and Load More Button */}
                {pagination && (
                  <div className="mt-8 space-y-4">
                    {/* Pagination Info */}
                    <div className="text-center text-sm text-gray-600">
                      Showing {offers.length} of {pagination.total} offers
                      {pagination.current_page < pagination.last_page && (
                        <span className="ml-2">
                          (Page {pagination.current_page} of {pagination.last_page})
                        </span>
                      )}
                    </div>

                    {/* Load More Button */}
                    {pagination.current_page < pagination.last_page && (
                      <div className="text-center">
                        <button
                          onClick={loadMore}
                          disabled={loadingMore}
                          className="px-8 py-3 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                        >
                          {loadingMore ? (
                            <>
                              <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                              Loading...
                            </>
                          ) : (
                            `Load More (${pagination.total - offers.length} remaining)`
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Offers;
