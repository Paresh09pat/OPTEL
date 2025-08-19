import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simulate form submission
    console.log('Registration Data:', formData);
    setSuccess('Registration successful!');
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md border border-[#808080]">
        <h2 className="text-2xl font-bold text-center text-[#808080] mb-6">Register</h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center mb-3">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border border-[#808080] rounded-md bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#808080]"
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              className="w-1/2 px-4 py-2 border border-[#808080] rounded-md bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#808080]"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#808080] rounded-md bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#808080]"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#808080] rounded-md bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#808080]"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#808080] rounded-md bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#808080]"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#808080] rounded-md bg-[#EDF6F9] focus:outline-none focus:ring-2 focus:ring-[#808080]"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[#808080] text-white py-2 rounded-md hover:bg-[#6e6e6e] transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
