import React from 'react';

const PageAnalytics = () => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Page Analytics</h2>
      
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex items-center space-x-2">
          <span className="text-red-500">❤</span>
          <span className="text-sm">25+ Likes</span>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="text-gray-600">
            <div className="text-sm">100</div>
            <div className="text-sm">80</div>
            <div className="text-sm">60</div>
            <div className="text-sm">40</div>
            <div className="text-sm">20</div>
            <div className="text-sm">0</div>
          </div>
          <div className="flex-1 ml-4">
            <svg viewBox="0 0 400 200" className="w-full h-32">
              {/* Blue line */}
              <path
                d="M 0 80 L 100 60 L 200 80 L 300 40 L 400 30"
                stroke="#60A5FA"
                strokeWidth="2"
                fill="none"
              />
              {/* Pink line */}
              <path
                d="M 0 100 L 100 120 L 200 100 L 300 80 L 400 70"
                stroke="#F472B6"
                strokeWidth="2"
                fill="none"
              />
              {/* Fill areas */}
              <path
                d="M 0 80 L 100 60 L 200 80 L 300 40 L 400 30 L 400 200 L 0 200 Z"
                fill="#60A5FA"
                opacity="0.2"
              />
              <path
                d="M 0 100 L 100 120 L 200 100 L 300 80 L 400 70 L 400 200 L 0 200 Z"
                fill="#F472B6"
                opacity="0.2"
              />
            </svg>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Likes</span>
          <span>Comments</span>
          <span>Save</span>
          <span>Share</span>
        </div>
        <div className="flex justify-center space-x-6 text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-pink-300 rounded-full mr-2"></span>
            <span>Feb 2025</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-300 rounded-full mr-2"></span>
            <span>Feb 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageAnalytics;