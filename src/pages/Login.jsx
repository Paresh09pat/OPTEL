import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'https://ouptel.com/requests.php?f=login',
        {
          username,
          password,
          remember_device: 'on',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );
      setUser(response.data.user);
      setToken(response.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#EDF6F9]">
        <p className="text-[#808080] text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm border border-[#808080]">
        <h1 className="text-2xl font-bold text-center text-[#808080] mb-6">Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EDF6F9] bg-[#EDF6F9] text-[#333]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-[#808080] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EDF6F9] bg-[#EDF6F9] text-[#333]"
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
