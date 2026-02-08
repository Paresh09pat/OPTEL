import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import Loader from '../components/loading/Loader';

const Events = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Events')
  const [myEvents, setMyEvents] = useState([]);
  const [eventOptions, setEventOptions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null)

  const dropdownOptions = ['Events', 'Going', 'Invited', 'Interested', 'Past'];

  // Format date to readable format (e.g., "Jan 15, 2024")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  // Format time to 12-hour format with AM/PM (e.g., "2:30 PM")
  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      // Handle both "HH:MM:SS" and "HH:MM" formats
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = minutes || '00';
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      
      return `${displayHour}:${minute} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  // Update eventOptions when selectedOption changes
  useEffect(() => {
    const mapping = {
      Events: 'upcoming',
      Going: 'going',
      Invited: 'invited',
      Interested: 'interested',
      Past: 'past'
    };
    setEventOptions(mapping[selectedOption] || 'my_events');
  }, [selectedOption]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/events?status=${eventOptions}&per_page=12`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMyEvents(data?.data );
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events whenever eventOptions changes
  useEffect(() => {
    getEvents();
  }, [eventOptions]);

  if (loading) return <Loader />;

  return (
    <div className="bg-[#EDF6F9] w-full min-h-screen py-8 flex flex-col gap-4">
      <div className="flex items-center justify-between px-4 md:px-7 flex-col md:flex-row gap-4">
        <h1 className="text-2xl font-bold text-[#212121] mb-4">My Events</h1>
        <div className="flex gap-6 items-center">
          {/* Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-[#212121] font-medium text-lg focus:outline-none"
            >
              {selectedOption}
              {isDropdownOpen ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 bg-white rounded-lg shadow-lg border border-[#d3d1d1] min-w-[120px] z-10">
                {dropdownOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`block w-full text-left px-4 py-2 text-[#212121] hover:bg-gray-100 ${selectedOption === option ? 'bg-gray-100' : ''
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/create-event')}
            className='border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5 hover:bg-white transition-colors'
          >
            <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
            <span className='text-[#808080] text-base font-medium'>Create Event</span>
          </button>
        </div>
      </div>

      {myEvents.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-sm p-8 w-full flex items-center justify-center border border-[#d3d1d1] text-center">
          <p className="text-gray-500 text-lg">No events found. Create your first event!</p>
        </div>
      )}
      
      <div className="pt-5 pb-6 px-7 border border-[#d3d1d1] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">
        
            
        {myEvents?.map((event) => 
          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#d3d1d1]" key={event?.id}>
            <div className="w-full h-[220px] bg-gray-100 rounded-t-lg border-b border-[#d3d1d1] overflow-hidden">
              <img 
                src={event?.image_url || event?.cover_url || "/pagesCardImg.png"} 
                alt="cardImg" 
                className='w-full h-full object-contain'
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/pagesCardImg.png";
                }}
              />
            </div>
            <div className="flex flex-col gap-2.5 w-full px-2.5">
              <h5 className='text-sm font-medium text-[#212121] w-full text-left'>{event?.name}</h5>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className='text-[#808080] text-xs font-medium'>{event?.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className='text-[#808080] text-xs font-medium'>
                    {formatDate(event?.start_date)} at {formatTime(event?.start_time)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <HiUsers className='text-[#808080] size-[14px]' />
                    <span className='text-[#808080] text-xs font-medium'>{event?.counts?.going || 0} Going</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className='text-[#808080] text-xs font-medium'>{event?.counts?.interested || 0} Interested</span>
                  </div>
                </div>
              </div>
            </div>

            <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg mx-auto mt-4 border border-[#d3d1d1] hover:bg-gray-50 transition-colors'>
              {event?.status === 'Past' ? 'View Event' : 'Join Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events; 