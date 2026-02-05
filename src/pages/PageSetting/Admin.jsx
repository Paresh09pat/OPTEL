import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from "react-icons/bi";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Admin = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch admins from API
  const fetchAdmins = async () => {
    if (!pageId) {
      toast.error('Page ID not found');
      return;
    }

    setLoading(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/pages/${pageId}/admins`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (response.data && response.data.api_status === 200) {
        setAdmins(response.data.admins || []);
      } else {
        toast.error('Failed to fetch admins');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error(error.response?.data?.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [pageId]);

  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchQuery.toLowerCase();
    return (
      admin.name?.toLowerCase().includes(searchLower) ||
      admin.username?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-xl p-3.5 px-9 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-2">Admin</h2>

      <div className="mb-4 relative">
        <BiSearchAlt className="w-5 h-5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-64 px-3 py-2 pl-10 border border-[#d3d1d1] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#1153e7]"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAdmins.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No admins found matching your search' : 'No admins found'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
          {filteredAdmins.map((admin, index) => (
            <div
              key={admin.user_id || index}
              onClick={() => navigate(`/profile/${admin.user_id}`)}
              className="border border-[#d3d1d1] rounded-3xl pt-5 px-2 pb-5 text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-16 h-16 bg-[#212121] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white overflow-hidden">
                {admin.avatar_url ? (
                  <img
                    src={admin.avatar_url}
                    alt={admin.name || admin.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <h3 className="font-semibold text-[#212121] mb-1">
                {admin.name || 'Unknown'}
              </h3>
              <p className="text-sm text-[#212121] mb-3.5">
                @{admin.username || 'unknown'}
              </p>
              {admin.is_owner ? (
                <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded text-sm font-semibold">
                  Owner
                </span>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement remove admin functionality
                    console.log('Remove admin:', admin.user_id);
                  }}
                  className="px-4 py-1 border border-[#d3d1d1] text-[#212121] bg-white rounded cursor-pointer transition-colors text-sm font-semibold hover:bg-[#f5f5f5]"
                >
                  Remove Admin
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
