import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiDollarSign } from 'react-icons/fi';
import { baseUrl } from '../utils/constant';
import Loader from '../components/loading/Loader';

const Jobs = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token")
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}/api/v1/jobs?type=all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        const formattedJobs = res.data.data.map((job) => ({
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
        }));
        setJobs(formattedJobs);
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6 px-2 md:px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Jobs</h2>
              <button
                onClick={() => navigate('/jobs/create')}
                className="border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5 hover:bg-gray-100 transition"
              >
                <img
                  src="/icons/gridicons_create.svg"
                  alt="create"
                  className="size-[15px]"
                />
                <span className="text-[#808080] text-base font-medium">
                  Create Job
                </span>
              </button>
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
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500 text-lg">No jobs available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {jobs.map((job) => (
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
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default Jobs;
