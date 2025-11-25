import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#EDF6F9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/op_logo.png" alt="Optel Logo" className="mx-auto h-20 w-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl shadow-lg border border-[#d3d1d1] p-8 md:p-12">
          {/* Placeholder for content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-500 text-center py-12">
              Terms of Service content will be added here.
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#1d60eb] hover:bg-[#1a4fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d60eb] transition-colors"
            >
              Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

