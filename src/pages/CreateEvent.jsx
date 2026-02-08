import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TimePicker from '../components/TimePicker';

const CreateEvent = () => {
  const navigate = useNavigate();
  
  // Event form states
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

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
        // Navigate back to events page
        navigate('/events');
      } else {
        toast.error(data?.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-[#EDF6F9] w-full min-h-screen py-8 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-7 flex-col md:flex-row gap-4">
        <h1 className="text-2xl font-bold text-[#212121]">Create Event</h1>
        <button
          onClick={() => navigate('/events')}
          className="border border-[#d3d1d1] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5 hover:bg-white transition-colors"
        >
          <span className="text-[#808080] text-base font-medium">Back to Events</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="w-[90%] lg:w-full mx-auto flex flex-col gap-4 bg-white rounded-lg overflow-hidden">
        {/* Hero Section with Wave Background */}
        <div className="relative w-full h-[10rem] md:h-[18rem] flex items-start justify-end p-6 md:p-16 overflow-hidden">
          <img 
            src="/Vectorgroup.svg" 
            alt="vector" 
            className='absolute bottom-0 right-0 top-0 left-0 w-full h-full object-cover' 
          />
          <h2 className="text-3xl text-white font-bold z-10 relative">Create Event</h2>
        </div>

        {/* Form */}
        <form className="w-full mx-auto flex flex-col gap-6 p-8" onSubmit={handleSubmit}>
          {/* Event Name */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event-name" className="text-lg text-black flex items-center gap-2">
              Event Name : <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="event-name"
              className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          {/* Event Description */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event-description" className="text-lg text-black flex items-center gap-2">
              Event Description : <span className="text-red-500">*</span>
            </label>
            <textarea
              id="event-description"
              className="w-full p-2 px-4 border border-[#d3d1d1] rounded-xl min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
            />
          </div>

          {/* Event Location */}
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="event-location" className="text-lg text-black flex items-center gap-2">
              Event Location : <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="event-location"
              className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </div>

          {/* Start Date and Time */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="start-date" className="text-lg text-black flex items-center gap-2">
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
              <label htmlFor="end-date" className="text-lg text-black flex items-center gap-2">
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
            <label className="text-lg text-black flex items-center gap-2">
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
                  <span className="font-medium text-sm">Select event image</span>
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
              className="w-full max-w-[20rem] cursor-pointer h-[50px] bg-blue-500 text-white font-semibold text-[20px] py-2 px-8 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? "Creating Event..." : "Publish Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
