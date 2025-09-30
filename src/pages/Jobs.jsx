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
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for jobs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
            <FiFilter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex h-screen bg-gray-100">
        {/* Left Sidebar */}
        <div className="w-1/2 bg-white  overflow-y-auto">
          <div className="p-4 space-y-4">
            {jobs.map((job, index) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(index)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedJob === index
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl font-bold flex-shrink-0">
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
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
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
        <div className="w-1/2 bg-white overflow-y-auto p-4">
          {selectedJobData && (
            <>
            <div className=" border border-gray-200  py-4 rounded-lg">
              {/* Job Header */}
              <div className="p-2 border-b border-gray-200 ">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold flex-shrink-0">
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
              <div className="p-2">
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm">
                    {selectedJobData.category}
                  </span>
                </div>

                {/* Job Details */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Detail</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Salary */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FiDollarSign className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Minimum {selectedJobData.currency}{selectedJobData.minSalary}</p>
                        <p className="text-sm text-gray-500">Maximum {selectedJobData.currency}{selectedJobData.maxSalary}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <FiMapPin className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">{selectedJobData.location}</p>
                      </div>
                    </div>

                    {/* Job Type */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiClock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 font-medium">{selectedJobData.type}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="mt-4">
                  <button className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200">
                    Apply Now
                  </button>
                </div>
              </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;
