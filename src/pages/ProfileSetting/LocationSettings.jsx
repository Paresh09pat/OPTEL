import React, { useState, useEffect } from "react";
import { FiMapPin, FiPlus, FiX } from "react-icons/fi";
import { FaEdit, FaTrash } from "react-icons/fa";

import axios from "axios";
import Avatar from "../../components/Avatar";

const LocationSettings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
    zipCode: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Get user ID from localStorage
  const userId = localStorage.getItem('user_id') || '222102'; // Default fallback

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setUserLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/profile/user-data?user_profile_id=${userId}&fetch=user_data`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setUserData(data.user_data);
          // Pre-fill form with user data
          setFormData({
            name: `${data.user_data.first_name || ''} ${data.user_data.last_name || ''}`.trim() || "",
            phone: data.user_data.phone_number || "",
            country: data.user_data.country || "",
            city: data.user_data.city || "",
            zipCode: data.user_data.zip_code || "",
            address: data.user_data.address || ""
          });
        } else {
          throw new Error(data.api_text || 'Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Fetch addresses from API
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setAddressesLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/addresses?limit=20`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );

        const data = response.data;
        
        if (data.api_status === '200') {
          setAddresses(data.data || []);
        } else {
          throw new Error(data.api_text || 'Failed to fetch addresses');
        }
      } catch (err) {
        console.error('Error fetching addresses:', err);
        setError('Failed to load addresses. Please try again.');
      } finally {
        setAddressesLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      const addressData = {
        name: formData.name,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        zip: formData.zipCode,
        address: formData.address
      };

      let response;
      if (editingAddress) {
        // Update existing address
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/v1/addresses/${editingAddress.id}`,
          addressData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );
      } else {
        // Create new address
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/addresses`,
          addressData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );
      }

      const data = response.data;
      
      if (data.api_status === '200') {
        setUpdateSuccess(true);
        setIsModalOpen(false);
        setEditingAddress(null);
        resetForm();
        
        // Refresh addresses list
        const addressesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/addresses?limit=20`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
            }
          }
        );
        
        if (addressesResponse.data.api_status === '200') {
          setAddresses(addressesResponse.data.data || []);
        }
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      } else {
        throw new Error(data.api_text || 'Failed to save address');
      }
      
    } catch (err) {
      console.error('Error saving address:', err);
      if (err.response?.data?.api_text) {
        setUpdateError(err.response.data.api_text);
      } else {
        setUpdateError('Failed to save address. Please try again.');
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      country: "",
      city: "",
      zipCode: "",
      address: ""
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setUpdateError(null);
    resetForm();
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || "",
      phone: address.phone || "",
      country: address.country || "",
      city: address.city || "",
      zipCode: address.zip || "",
      address: address.address || ""
    });
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/v1/addresses/${addressId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token') || ''}`,
          }
        }
      );

      const data = response.data;
      
      if (data.api_status === '200') {
        // Remove address from local state
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        throw new Error(data.api_text || 'Failed to delete address');
      }
      
    } catch (err) {
      console.error('Error deleting address:', err);
      if (err.response?.data?.api_text) {
        setUpdateError(err.response.data.api_text);
      } else {
        setUpdateError('Failed to delete address. Please try again.');
      }
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">
        Location Settings
      </h2>


      {/* Addresses List */}
      {addressesLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading addresses...</p>
          </div>
        </div>
      ) : addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-[#d3d1d1] rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="text-purple-500 text-lg" />
                    <h3 className="font-semibold text-gray-800">{address.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{address.phone}</p>
                  <p className="text-gray-600 text-sm mb-1">
                    {address.address}, {address.city}, {address.country} {address.zip}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="px-3 py-1 text-blue-600 border border-blue-600 rounded text-sm hover:bg-blue-50 transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="px-3 py-1 text-red-600 border border-red-600 rounded text-sm hover:bg-red-50 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add New Address Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <FiPlus className="text-lg" />
              Add New Address
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex justify-center items-center py-12">
          <div 
            className="bg-gray-100 rounded-lg p-8 cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
            onClick={handleAddNew}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <FiMapPin className="text-gray-600 text-4xl" />
                <FiPlus className="absolute -top-1 -right-1 text-white bg-gray-600 rounded-full p-1 text-sm" />
              </div>
              <p className="text-gray-600 text-sm font-medium">Add Your First Address</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  placeholder="Enter your country"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  placeholder="Enter your city"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  placeholder="Enter your zip code"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  placeholder="Enter your full address"
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-[#d3d1d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {updateError && (
                <div className="text-red-500 text-sm text-center">{updateError}</div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingAddress ? 'Updating...' : 'Adding...'}
                    </div>
                  ) : (
                    editingAddress ? 'Update' : 'Add'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">Address {editingAddress ? 'updated' : 'added'} successfully!</p>
        </div>
      )}
      
      {updateError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{updateError}</p>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LocationSettings;
