import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const NotFound404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#1d60eb] opacity-20 blur-3xl rounded-full"></div>
            <div className="relative">
              <FiAlertCircle className="w-32 h-32 mx-auto text-[#1d60eb]" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-9xl font-bold text-[#1d60eb] mb-4 leading-none">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d60eb] transition-colors"
          >
            <FiArrowLeft className="mr-2 w-5 h-5" />
            Go Back
          </button>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#1d60eb] hover:bg-[#1a4fc7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1d60eb] transition-colors"
          >
            <FiHome className="mr-2 w-5 h-5" />
            Go to Home
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help? Try these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/login"
              className="text-[#1d60eb] hover:text-[#1a4fc7] hover:underline"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-[#1d60eb] hover:text-[#1a4fc7] hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound404;

