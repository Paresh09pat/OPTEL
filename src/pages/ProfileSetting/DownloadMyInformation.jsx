import React, { useState, useEffect } from "react";
import { FiInfo, FiFileText, FiFlag, FiUsers, FiUser, FiDownload } from "react-icons/fi";
import axios from "axios";
import Avatar from "../../components/Avatar";

const DownloadMyInformation = () => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

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

  const downloadOptions = [
    {
      id: 'my-information',
      title: 'My Information',
      icon: FiInfo,
      description: 'Personal profile data'
    },
    {
      id: 'posts',
      title: 'Posts',
      icon: FiFileText,
      description: 'All your posts and content'
    },
    {
      id: 'pages',
      title: 'Pages',
      icon: FiFlag,
      description: 'Pages you manage or follow'
    },
    {
      id: 'groups',
      title: 'Groups',
      icon: FiUsers,
      description: 'Groups you belong to'
    },
    {
      id: 'friends',
      title: 'Friends',
      icon: FiUser,
      description: 'Your friends list'
    }
  ];

  const handleCardClick = (cardId) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const handleGenerateFile = async () => {
    if (selectedCards.length === 0) {
      setError('Please select at least one option to download.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call for generating download file
      console.log('Generating file for:', selectedCards);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to generate the file
      // and then trigger a download
      
      alert(`File generated successfully for: ${selectedCards.join(', ')}`);
    } catch (err) {
      setError('Failed to generate file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#d3d1d1] pb-2 mb-6">
        Download My Information
      </h2>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#d3d1d1]">
        <Avatar
          src={userData?.avatar_url}
          name={`${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'User Name'}
          email={userData?.email}
          alt="profile photo"
          size="lg"
          className="w-16 h-16"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {userLoading ? 'Loading...' : `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'User Name'}
          </h3>
          <p className="text-gray-600">
            @{userLoading ? 'loading...' : userData?.username || 'username'}
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-gray-600 text-center px-2">
          Please choose which information you would like to download
        </p>
      </div>

      {/* Download Options Grid */}
      <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {downloadOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedCards.includes(option.id);
          
          return (
            <div
              key={option.id}
              onClick={() => handleCardClick(option.id)}
              className={`
                bg-white rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 border-2
                ${isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3
                  ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}
                `}>
                  <Icon className={`text-lg sm:text-xl ${isSelected ? 'text-purple-600' : 'text-gray-600'}`} />
                </div>
                <h3 className={`font-medium text-xs sm:text-sm ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>
                  {option.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm text-center mb-4">{error}</div>
      )}

      {/* Generate File Button */}
      <div className="flex justify-center sm:justify-end">
        <button
          onClick={handleGenerateFile}
          disabled={loading || selectedCards.length === 0}
          className={`
            w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
            ${loading || selectedCards.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
            }
          `}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm sm:text-base">Generating...</span>
            </>
          ) : (
            <>
              <FiDownload className="text-base sm:text-lg" />
              <span className="text-sm sm:text-base">Generate file</span>
            </>
          )}
        </button>
      </div>

      {/* Selected Items Info */}
      {selectedCards.length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-xs sm:text-sm text-purple-700 text-center sm:text-left">
            <strong>Selected:</strong> {selectedCards.length} item{selectedCards.length !== 1 ? 's' : ''} - {downloadOptions.filter(opt => selectedCards.includes(opt.id)).map(opt => opt.title).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DownloadMyInformation;
