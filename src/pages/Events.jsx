import React, { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { HiUsers } from 'react-icons/hi';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';
import TimePicker from '../components/TimePicker';

const Events = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Events')
  const [myEvents, setMyEvents] = useState([]);
  const [eventOptions, setEventOptions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null)

  // Event form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

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

  // Event form handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventName.trim()) {
      toast.error("Please enter event name");
      return;
    }
    
    if (!eventLocation.trim()) {
      toast.error("Please enter event location");
      return;
    }
    
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    
    if (!startTime || !endTime) {
      toast.error("Please select start and end times");
      return;
    }
    
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    try {
      setFormLoading(true);
      const accessToken = localStorage.getItem("access_token");
      
      const formData = new FormData();
      formData.append("name", eventName);
      formData.append("location", eventLocation);
      formData.append("start_date", startDate);
      formData.append("start_time", startTime);
      formData.append("end_date", endDate);
      formData.append("end_time", endTime);
      formData.append("image", selectedFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/events`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Accept": "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.ok === true) {
        toast.success("Event created successfully!");
        // Reset form
        setEventName('');
        setEventDescription('');
        setEventLocation('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setSelectedFile(null);
        setShowCreateForm(false);
        // Refresh events list
        getEvents();
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <Loader />;


    return (
      <div className="bg-[#EDF6F9] w-full min-h-screen  py-8 flex flex-col gap-4">
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
              onClick={() => setShowCreateForm(true)}
              className='border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5'
            >
              <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
              <span className='text-[#808080] text-base font-medium'>Create Event</span>
            </button>
          </div>
        </div>

        {showCreateForm ? (
          <div className="bg-[#EDF6F9] w-full h-full flex flex-col">
            <div className="w-full h-[98px] sticky pt-8 top-0 z-10 bg-[#EDF6F9]
            ">
              <div className="flex items-center justify-between h-full px-4 md:px-7 md:flex-row gap-4">
                <h1 className="text-2xl font-bold text-[#212121] mb-4">
                  Create Event
                </h1>
                <div className="flex gap-6 items-center mb-4">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5"
                  >
                    <span className="text-[#808080] text-base font-medium">
                      Back to Events
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-[90%] lg:w-full mx-auto flex flex-col gap-4 bg-white ">
              <div className="relative w-full h-[10rem] md:h-[18rem] flex items-start justify-end p-6 md:p-16 rounded-lg overflow-hidden">
                {/* Wave SVG */}
                <img src="/Vectorgroup.svg" alt="vector" className='absolute bottom-0 right-0 top-0 w-full h-full object-cover' />
                <h2 className="text-3xl text-white font-bold z-10">Create Event</h2>
              </div>

              <form
                className="w-full mx-auto flex flex-col gap-6 p-8"
                onSubmit={handleSubmit}
              >
                {/* Event Name */}
                <div className="w-full flex flex-col gap-2">
                  <label
                    htmlFor="event-name"
                    className="text-lg text-black flex items-center gap-2"
                  >
                    Event Name : <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="event-name"
                    className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full"
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </div>

                {/* Event Description */}
                <div className="w-full flex flex-col gap-2">
                  <label
                    htmlFor="event-description"
                    className="text-lg text-black flex items-center gap-2"
                  >
                    Event Description : <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="event-description"
                    className="w-full p-2 px-4 border border-[#d3d1d1] rounded-xl min-h-[100px] resize-none"
                    placeholder="Event Description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Event Location */}
                <div className="w-full flex flex-col gap-2">
                  <label
                    htmlFor="event-location"
                    className="text-lg text-black flex items-center gap-2"
                  >
                    Event Location : <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="event-location"
                    className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full"
                    placeholder="Event Location"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    required
                  />
                </div>

                {/* Start Date and Time */}
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <div className="w-full flex flex-col gap-2">
                    <label
                      htmlFor="start-date"
                      className="text-lg text-black flex items-center gap-2"
                    >
                      Start Date : <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="start-date"
                        className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                    label="Start Time :"
                    required
                  />
                </div>

                {/* End Date and Time */}
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <div className="w-full flex flex-col gap-2">
                    <label
                      htmlFor="end-date"
                      className="text-lg text-black flex items-center gap-2"
                    >
                      End Date : <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="end-date"
                        className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                      <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                    label="End Time :"
                    required
                  />
                </div>

                {/* Media Upload Section */}
                <div className="w-full flex flex-col gap-2">
                  <label
                    className="text-lg text-black flex items-center gap-2"
                  >
                    Event Media : <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="file"
                    id="event-media"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="w-full min-h-[200px] border border-[#d3d1d1] rounded-xl flex flex-col items-center justify-center gap-2 text-[#555] p-4">
                    {!selectedFile ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <img
                          src="/icons/selectAlbum.png"
                          alt="upload"
                          className="w-14 h-14 opacity-70"
                        />
                        <span className="font-medium text-sm">
                          Select event image
                        </span>
                        <button
                          type="button"
                          onClick={() => document.getElementById('event-media').click()}
                          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          Choose File
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center w-full">
                        <div className="relative group w-[200px] h-[200px] rounded overflow-hidden border">
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 text-lg flex items-center justify-center cursor-pointer transition-colors shadow-lg"
                            title="Remove"
                          >
                            ×
                          </button>
                          <button
                            type="button"
                            onClick={() => document.getElementById('event-media').click()}
                            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="w-full text-center">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-[20rem] cursor-pointer h-[50px] bg-blue-500 text-white font-semibold text-[20px] py-2 px-8 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? "Creating Event..." : "Publish Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            {myEvents.length === 0 && !loading && (
              <div className="bg-white rounded-lg shadow-sm p-8 w-full flex items-center justify-center border border-[#d3d1d1] text-center">
                <p className="text-gray-500 text-lg">No events found. Create your first event!</p>
              </div>
            )}
            <div className="pt-5 pb-6 px-7 border border-[#d3d1d1] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-5 bg-white">
        
            
         
          {myEvents?.map((event) => 
          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#d3d1d1]" key={event?.id}>
            <img src={event?.image_url || event?.cover_url || "/pagesCardImg.png"} alt="cardImg" className='w-full h-[160px] object-cover rounded-t-lg border-b border-[#d3d1d1]' />
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
                  <span className='text-[#808080] text-xs font-medium'>{event?.start_date} at {event?.start_time}</span>
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
          </>
        )}
      </div>
    )
  }

  export default Events 