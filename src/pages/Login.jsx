import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/login`,
        {
          email: username,
          password,
          // server_key: "24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179",
          // device_type: "windows"
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

        navigate("/");
      } else {
        setError(response?.data?.message);
        console.log(response?.data?.message, "error");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      console.log("error>>>", error.response.data.message);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#EDF6F9]">
        <p className="text-[#808080] text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm border border-[#d3d1d1]">
        <h1 className="text-2xl font-bold text-center text-[#808080] mb-6">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-[#d3d1d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EDF6F9] bg-[#EDF6F9] text-[#333]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#d3d1d1] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EDF6F9] bg-[#EDF6F9] text-[#333]"
          />
          <button
            type="submit"
            className="w-full bg-[#808080] text-white py-2 rounded-md hover:bg-[#6e6e6e] transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
