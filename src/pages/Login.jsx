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
      <div className="relative w-full max-w-md">
        {/* Glassmorphism card */}
        <div className={`bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/20 relative overflow-hidden ${loading ? 'opacity-75 pointer-events-none' : ''}`}>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Logo and branding */}
            <div className="text-center mb-8">
              
                <img src="/op_logo.png" alt="logo" className=' w-1/3 mx-auto my-4' />
             
            
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm">Sign in to your account</p>
            </div>

            {/* Login form */}
            <form onSubmit={handleLogin} className="space-y-6">
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
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
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
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>

              {/* Remember me and forgot password */}
              {/* <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot password?
                </a>
              </div> */}

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute -z-10 -top-4 -left-4 w-8 h-8 bg-blue-200 rounded-full opacity-60"></div>
        <div className="absolute -z-10 -bottom-6 -right-6 w-12 h-12 bg-purple-200 rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default Login;