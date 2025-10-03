import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiFilter, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';

const Jobs = () => {
  const token = localStorage.getItem("access_token")
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/jobs?type=all`, {
      headers: {
        Authorization: `Bearer ${token}`, // 🔑 attach token
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
          whatsapp: null,
        }));
        setJobs(formattedJobs);
      })
      .catch((err) => console.error(err));
  }, []);
  

  const selectedJobData = jobs[selectedJob] || {};

  return (
    <>
      <div className="min-h-screen bg-[#EDF6F9] relative pb-15 smooth-scroll">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-6">
        
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 px-2 md:px-4">Jobs</h2>
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

          {/* Layout */}
          <div className="px-2 md:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
              {/* Left Sidebar - Job List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Available Jobs</h3>
                </div>
                <div className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {jobs.map((job, index) => (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(index)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedJob === index
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold flex-shrink-0">
                          {job.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {job.company}
                          </h3>
                          <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                            {job.title}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                              {job.category}
                            </span>
                            <div className="flex items-center text-gray-600 text-sm">
                              <FiDollarSign className="w-4 h-4 mr-1" />
                              <span>
                                {job.currency}{job.minSalary} - {job.currency}{job.maxSalary}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Job Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {selectedJobData && (
                  <>
                    {/* Job Header */}
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold flex-shrink-0">
                          {selectedJobData.logo}
                        </div>
                        <div className="flex-1">
                          <h1 className="text-xl font-bold text-gray-900 mb-1">
                            {selectedJobData.company}
                          </h1>
                          <p className="text-lg text-gray-700 font-medium">
                            {selectedJobData.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Job Overview */}
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Job Overview</h2>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          {selectedJobData.title}
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedJobData.description}
                        </p>
                      </div>

                      {/* Category */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-medium">
                          {selectedJobData.category}
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
                        <div className="space-y-4">
                          {/* Salary */}
                          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <FiDollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Salary Range</p>
                              <p className="text-sm text-gray-900 font-medium">
                                {selectedJobData.currency}{selectedJobData.minSalary} - {selectedJobData.currency}{selectedJobData.maxSalary}
                              </p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FiMapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Location</p>
                              <p className="text-sm text-gray-900 font-medium">{selectedJobData.location}</p>
                            </div>
                          </div>

                          {/* Job Type */}
                          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <FiClock className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Job Type</p>
                              <p className="text-sm text-gray-900 font-medium">{selectedJobData.type}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="mt-6">
                        <button className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200 shadow-sm">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;
