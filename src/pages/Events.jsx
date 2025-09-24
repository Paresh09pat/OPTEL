import React, { useState, useEffect, useRef } from 'react'
import { HiUsers } from 'react-icons/hi'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import axios from 'axios';
import Loader from '../components/loading/Loader';

const Events = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Events')
  const [myEvents, setMyEvents] = useState([]);
  const [eventOptions, setEventOptions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null)

  const dropdownOptions = ['Events', 'Going', 'Invited', 'Interested', 'Past'];

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

      // const accessToken =
      //   localStorage.getItem('access_token');

      // const formData = new URLSearchParams();
      // formData.append(
      //   'server_key',
      //   '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179'
      // );
      // formData.append('fetch', eventOptions);

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
  console.log(myEvents , "my events list");

    return (
      <div className="bg-[#EDF6F9] w-full h-full pt-8 flex flex-col gap-4">
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

                            <button className='border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5'>
              <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
              <span className='text-[#808080] text-base font-medium'>Create Event</span>
            </button>
          </div>
        </div>

        {myEvents.length === 0 && !loading && (
            <div className="bg-white rounded-lg shadow-sm p-8 w-full flex items-center justify-center border border-[#d3d1d1] text-center">
              <p className="text-gray-500 text-lg">No events found. Create your first event!</p>
            </div>
          ) }
        <div className="pt-5 pb-6 px-7 border border-[#d3d1d1] rounded-lg grid grid-cols-1 md:grid-cols-2  gap-4 bg-white">
        
            
         
          {myEvents?.map((event) => 
          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#d3d1d1]" key={event?.id}>
            <img src={event?.cover || "/pagesCardImg.png"} alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
              <h5 className='text-sm font-medium text-[#212121] w-full text-left'>{event?.name}</h5>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <HiUsers className='text-[#808080] size-[15px]' />
                  <span className='text-[#808080] text-xs font-medium'>20 Members</span>
                </div>
                <div className="flex gap-1.5">
                  <img src="/icons/book.png" alt="book" className='size-[15px]' />
                  <span className='text-[#808080] text-xs font-medium'>200+Posts</span>
                </div>
              </div>
            </div>

            <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#d3d1d1]'>Join Now</button>

          </div>
          )}

         
        </div>
      </div>
    )
  }

  export default Events 