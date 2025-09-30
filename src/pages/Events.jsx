import React, { useState, useEffect, useRef } from 'react'
import { HiUsers } from 'react-icons/hi'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import axios from 'axios';
import Loader from '../components/loading/Loader';
import { Link } from 'react-router-dom';

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
  const [endDate, setEndDate] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

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
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log({
      eventName,
      eventDescription,
      eventLocation,
      startDate,
      endDate,
      selectedFiles
    });
    // Reset form
    setEventName('');
    setEventDescription('');
    setEventLocation('');
    setStartDate('');
    setEndDate('');
    setSelectedFiles([]);
    setShowCreateForm(false);
  };

  if (loading) return <Loader />;
  console.log(myEvents , "my events list");

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
              <div
                style={{ backgroundSize: "cover" }}
                className='w-full h-[10rem] md:h-[18rem] bg-[url("/eventsformbgimg.svg")] bg-no-repeat bg-top rounded-lg'
              >
                <div className="w-full flex items-end justify-end p-6 md:p-16">
                  <h2 className="text-3xl text-white font-bold">Create Event</h2>
                </div>
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

                {/* Start Date and End Date */}
                <div className="w-full flex flex-col md:flex-row gap-4">
                  <div className="w-full flex flex-col gap-2">
                    <label
                      htmlFor="start-date"
                      className="text-lg text-black flex items-center gap-2"
                    >
                      Start Date : <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <label
                      htmlFor="end-date"
                      className="text-lg text-black flex items-center gap-2"
                    >
                      End Date : <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="end-date"
                      className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Media Upload Section */}
                <div className="w-full flex flex-col gap-2">
                  <label
                    htmlFor="event-media"
                    className="text-lg text-black flex items-center gap-2"
                  >
                    Event Media : <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="file"
                    id="event-media"
                    accept="image/*, video/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <label
                    htmlFor="event-media"
                    className="w-full min-h-[200px] border border-[#d3d1d1] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer text-[#555] p-4"
                  >
                    {selectedFiles.length === 0 ? (
                      <>
                        <img
                          src="/icons/selectAlbum.png"
                          alt="upload"
                          className="w-14 h-14 opacity-70"
                        />
                        <span className="font-medium text-sm">
                          Select photos & video
                        </span>
                      </>
                    ) : (
                      <div className="flex flex-wrap justify-center gap-4 w-full">
                        {selectedFiles.map((file, index) => {
                          const fileURL = URL.createObjectURL(file);
                          return (
                            <div
                              key={index}
                              className="relative group w-[100px] h-[100px] rounded overflow-hidden border"
                            >
                              {file.type.startsWith("image") ? (
                                <img
                                  src={fileURL}
                                  alt="preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={fileURL}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer"
                                title="Remove"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </label>
                </div>

                {/* Submit */}
                <div className="w-full text-center">
                  <button
                    type="submit"
                    className="w-[20rem] cursor-pointer h-[50px] border border-[#F25E4E] text-[#F25E4E] font-semibold text-[20px] py-2 px-8 rounded-lg hover:bg-[#F25E4E] transition hover:text-[#fff]"
                  >
                    Publish Event
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
          </>
        )}
      </div>
    )
  }

  export default Events 