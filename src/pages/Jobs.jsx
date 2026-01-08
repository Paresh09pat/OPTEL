import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiDollarSign } from 'react-icons/fi';
import { baseUrl } from '../utils/constant';
import Loader from '../components/loading/Loader';

const Jobs = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token")
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'applied'
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(null);
  const [appliedPagination, setAppliedPagination] = useState(null);

  const fetchJobs = useCallback(async (page = 1, type = 'all') => {
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await axios.get(`${baseUrl}/api/v1/jobs?type=${type}&per_page=12&page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const formattedJobs = response.data.data.map((job) => ({
        id: job.id,
        company: job.company || 'Unknown Company',
        logo: '💼',
        title: job.title,
        description: job.description,
        category: job.type,
        minSalary: job.salary || 0,
        maxSalary: job.salary || 0,
        currency: '$',
        location: job.location,
        type: job.type,
        status: job.status,
        is_applied: job.is_applied,
        applications_count: job.applications_count,
        owner: job.owner,
        created_at: job.created_at,
      }));

      if (page === 1) {
        if (type === 'all') {
          setJobs(formattedJobs);
        } else {
          setAppliedJobs(formattedJobs);
        }
      } else {
        if (type === 'all') {
          setJobs(prev => [...prev, ...formattedJobs]);
        } else {
          setAppliedJobs(prev => [...prev, ...formattedJobs]);
        }
      }

      if (response.data.meta) {
        if (type === 'all') {
          setPagination(response.data.meta);
        } else {
          setAppliedPagination(response.data.meta);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs(1, activeTab);
  }, [activeTab, fetchJobs]);

  const loadMore = () => {
    const currentPagination = activeTab === 'all' ? pagination : appliedPagination;
    if (currentPagination && currentPagination.current_page < currentPagination.last_page) {
      fetchJobs(currentPagination.current_page + 1, activeTab);
    }
  };

  const filteredJobs = (activeTab === 'all' ? jobs : appliedJobs).filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Jobs</h2>
            </div>

            {/* Tabs */}
            <div className="px-2 md:px-4">
              <div className="flex gap-2 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                    activeTab === 'all'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Jobs
                  {activeTab === 'all' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('applied')}
                  className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                    activeTab === 'applied'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Applied Jobs
                  {activeTab === 'applied' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                  )}
                </button>
              </div>
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
                    placeholder="Search for jobs..."
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

          {/* Jobs List */}
          <div className="px-2 md:px-4">
            {loading && (activeTab === 'all' ? jobs.length === 0 : appliedJobs.length === 0) ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-lg">
                  {activeTab === 'applied' ? 'No applied jobs found' : 'No jobs available'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                    >
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold flex-shrink-0">
                          {job.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base mb-1 truncate">
                            {job.company}
                          </h3>
                          <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                            {job.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full capitalize">
                          {job.category}
                        </span>
                        {job.minSalary > 0 && (
                          <div className="flex items-center text-gray-600 text-xs">
                            <FiDollarSign className="w-3 h-3 mr-1" />
                            <span>
                              {job.currency}{job.minSalary}
                              {job.maxSalary > job.minSalary ? ` - ${job.currency}${job.maxSalary}` : ''}
                            </span>
                          </div>
                        )}
                        {activeTab === 'applied' && job.is_applied && (
                          <span className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full font-medium">
                            Applied
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {job.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500 capitalize">{job.type}</span>
                        <span className="text-xs text-blue-600 font-medium">View Details →</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Info and Load More Button */}
                {(activeTab === 'all' ? pagination : appliedPagination) && (
                  <div className="mt-8 space-y-4">
                    {/* Pagination Info */}
                    <div className="text-center text-sm text-gray-600">
                      Showing {(activeTab === 'all' ? jobs : appliedJobs).length} of {(activeTab === 'all' ? pagination : appliedPagination)?.total || 0} jobs
                      {(activeTab === 'all' ? pagination : appliedPagination)?.current_page < (activeTab === 'all' ? pagination : appliedPagination)?.last_page && (
                        <span className="ml-2">
                          (Page {(activeTab === 'all' ? pagination : appliedPagination)?.current_page} of {(activeTab === 'all' ? pagination : appliedPagination)?.last_page})
                        </span>
                      )}
                    </div>

                    {/* Load More Button */}
                    {(activeTab === 'all' ? pagination : appliedPagination)?.current_page < (activeTab === 'all' ? pagination : appliedPagination)?.last_page && (
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
                            `Load More (${((activeTab === 'all' ? pagination : appliedPagination)?.total || 0) - (activeTab === 'all' ? jobs : appliedJobs).length} remaining)`
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

export default Jobs;
