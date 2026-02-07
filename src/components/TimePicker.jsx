import React, { useState, useRef, useEffect } from 'react';

const TimePicker = ({ value, onChange, label, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const dropdownRef = useRef(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const period = hour24 >= 12 ? 'PM' : 'AM';
      
      setSelectedHour(hour12.toString().padStart(2, '0'));
      setSelectedMinute(minutes);
      setSelectedPeriod(period);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleTimeChange = (hour, minute, period) => {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (period === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute}`;
    onChange(timeString);
  };

  const handleHourClick = (hour) => {
    setSelectedHour(hour);
    handleTimeChange(hour, selectedMinute, selectedPeriod);
  };

  const handleMinuteClick = (minute) => {
    setSelectedMinute(minute);
    handleTimeChange(selectedHour, minute, selectedPeriod);
  };

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    handleTimeChange(selectedHour, selectedMinute, period);
  };

  const displayTime = value 
    ? `${selectedHour}:${selectedMinute} ${selectedPeriod}`
    : 'Select time';

  return (
    <div className="w-full flex flex-col gap-2" ref={dropdownRef}>
      {label && (
        <label className="text-lg text-black flex items-center gap-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 px-4 border border-[#d3d1d1] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white"
        >
          <span className={value ? 'text-black' : 'text-gray-400'}>
            {displayTime}
          </span>
        </button>
        <svg 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-white border border-[#d3d1d1] rounded-xl shadow-2xl p-4">
            <div className="flex gap-2">
              {/* Hours */}
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-600 mb-2 text-center">Hour</div>
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => handleHourClick(hour)}
                      className={`w-full px-3 py-2 text-center rounded-lg transition-colors ${
                        selectedHour === hour
                          ? 'bg-blue-500 text-white font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {hour}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes */}
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-600 mb-2 text-center">Minute</div>
                <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => handleMinuteClick(minute)}
                      className={`w-full px-3 py-2 text-center rounded-lg transition-colors ${
                        selectedMinute === minute
                          ? 'bg-blue-500 text-white font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {minute}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM */}
              <div className="w-16">
                <div className="text-xs font-semibold text-gray-600 mb-2 text-center">Period</div>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handlePeriodClick('AM')}
                    className={`px-3 py-2 text-center rounded-lg transition-colors ${
                      selectedPeriod === 'AM'
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePeriodClick('PM')}
                    className={`px-3 py-2 text-center rounded-lg transition-colors ${
                      selectedPeriod === 'PM'
                        ? 'bg-blue-500 text-white font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimePicker;
