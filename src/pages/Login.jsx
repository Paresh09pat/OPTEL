import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaShieldAlt, FaUser } from "react-icons/fa";
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import { baseUrl } from '../utils/constant';

const Login = () => {
  const navigate = useNavigate();
  const { refreshUserData } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/login`,
        {
          email: username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response, "response");

      if (response.data.ok === true) {
        console.log(response?.data, "response data");
        localStorage.setItem("user_id", response?.data?.data?.user_id);
        localStorage.setItem("access_token", response?.data?.data?.token);
        localStorage.setItem("membership", response?.data?.data?.membership);
        localStorage.setItem("isVerified", response?.data?.data?.isVerified);

        // Refresh user data immediately after login
        refreshUserData();
        
        toast.success('Login successful!');
        navigate("/");
      } else {
        const errorMsg = response?.data?.message || 'Login failed. Please try again.';
        toast.error(errorMsg);
        console.log(response?.data?.message, "error");
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Network error. Please check your connection and try again.';
      toast.error(errorMsg);
      console.log("error>>>", error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const response = await axios.post(
        'https://admin.ouptel.in/api/v1/password/forgot',
        {
          email: forgotEmail,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.api_status === "200") {
        toast.success(response.data.message || 'Password reset link sent to your email!');
        setShowForgotPassword(false);
        setForgotEmail('');
      } else {
        toast.error(response.data.message || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Network error. Please try again.';
      toast.error(errorMsg);
      console.log("Forgot password error:", error?.response?.data?.message || error.message);
    } finally {
      setForgotLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");
    if (isLoggedIn && userId) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 blur-3xl"></div>
      </div>

      {/* Login container */}
      <div className="relative w-full max-w-5xl">
        {/* Glassmorphism card with split layout */}
        <div className={`bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20 relative ${loading ? 'opacity-75 pointer-events-none' : ''}`}>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-12 items-center justify-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              
              {/* Image container */}
              <div className="relative z-10 w-full max-w-md">
                <img 
                  src="/login_img.png" 
                  alt="Login illustration" 
                  className="w-full h-auto drop-shadow-2xl"
                  onError={(e) => {
                    e.target.src = '/op_logo.png';
                  }}
                />
                
                {/* Welcome text */}
                <div className="mt-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-3">Welcome to OUPTEL</h2>
                  <p className="text-white/80 text-lg">Connect, Share, and Explore</p>
                </div>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 relative z-10">
              {/* Logo for mobile */}
              <div className="md:hidden text-center mb-6">
                <img src="/op_logo.png" alt="logo" className='w-1/3 mx-auto mb-4' />
              </div>

              {/* Form header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-500">Sign in to continue to your account</p>
              </div>

              {/* Login form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Username field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Password field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Sign up link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                    Sign up 
                  </Link>
                  <span> here</span>
                </p>
              </div>

              {/* Mobile welcome text */}
              <div className="md:hidden mt-8 text-center">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome to OPTEL
                </h2>
                <p className="text-gray-500 text-sm">Connect, Share, and Explore</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute -z-10 -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute -z-10 -bottom-6 -right-6 w-12 h-12 bg-purple-200 rounded-full opacity-40"></div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            {/* Close button */}
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setForgotEmail('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <FaLock className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
              <p className="text-gray-600 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Forgot password form */}
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {forgotLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotEmail('');
                }}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm font-medium transition-colors"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;