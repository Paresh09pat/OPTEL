import React, { useState, useEffect, useRef } from 'react'
import { HiUsers } from 'react-icons/hi'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

const Events = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState('Events')
  const dropdownRef = useRef(null)

  const dropdownOptions = [
    'Events',
    'Going',
    'Invited',
    'Interested',
    'Pastor'
  ]

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
              <div className="absolute right-0 mt-2 py-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[120px] z-10">
                {dropdownOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`block w-full text-left px-4 py-2 text-[#212121] hover:bg-gray-100 ${
                      selectedOption === option ? 'bg-gray-100' : ''
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className='border border-[#808080] cursor-pointer py-1.5 px-3.5 rounded-2xl flex items-center gap-1.5'>
            <img src="/icons/gridicons_create.svg" alt="create" className='size-[15px]' />
            <span className='text-[#808080] text-base font-medium'>Create Event</span>
          </button>
        </div>
      </div>

      <div className="pt-5 pb-6 px-7 border border-[#808080] rounded-lg grid grid-cols-1 md:grid-cols-2  gap-4 bg-white">
        <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
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
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>

          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
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
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>

          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
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
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>

          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
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
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>

          <div className="flex flex-col gap-2 min-w-full bg-[#FFFFFF] shadow-2xl  pb-3 px-0.5 shadow-[#21212140] rounded-lg border border-[#21212140]">
            <img src="/pagesCardImg.png" alt="cardImg" className=' w-full h-[160px] object-cover rounded-lg' />
            <div className="flex flex-col gap-2.5 w-full px-2.5">
            <h5 className='text-sm font-medium text-[#212121] w-full text-left'>EchoVerse: The Sound Awakens</h5>
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
           
              <button className='bg-[#ffff] text-black px-7 py-0.5 rounded-lg  mx-auto mt-6 border border-[#212121]'>Join Now</button>
           
          </div>
          </div>
    </div>  
  )
}

export default Events 