import React from 'react'
import { FaPlus, FaUser, FaUsers } from 'react-icons/fa'
import { CiCircleMore } from 'react-icons/ci'
import { BiBell } from 'react-icons/bi'
import { FaTimes } from 'react-icons/fa'

const Chatbox = ({ onClose, isMobile = false }) => {
  return (
    <div className={`bg-[#EDF6F9] px-6 py-8 h-full overflow-y-auto scrollbar-hide smooth-scroll ${
      isMobile ? 'w-full' : 'w-90'
    }`}>
      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex justify-between items-center mb-4 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Messages & Activity</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Profile Section */}
      <div className="w-full p-3 rounded-lg bg-white shadow-[#EDF6F9] shadow-md border border-[#808080]">
        <div className="flex p-4 items-center justify-between">
          <div className="relative w-[58px] h-[58px] rounded-full bg-[#EDF6F9] border-[4px] border-inset border-[#ffffff] shadow-md shadow-fuchsia-400">
            <div className="grid place-items-center absolute -right-1 -bottom-1 bg-black w-5 h-5 rounded-full border-inset border-[2px] shadow-2xl shadow-fuchsia-400 border-white">
              <FaPlus className='text-white size-[10px]' />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500 size-[25px] cursor-pointer' width={24} height={24} viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7}></circle>
                <path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path>
              </g>
            </svg>
            <BiBell className='text-gray-500 size-[25px] cursor-pointer' />
            <CiCircleMore className='text-gray-500 size-[25px] cursor-pointer' />
            <input type="text" placeholder='Search' className='text-gray-500 text-sm outline-none ml-2 w-full bg-transparent hidden transition-colors duration-300 rounded-md p-2' />
          </div>
        </div>
      </div>

      {/* Individual/Groups Toggle */}
      <div className="flex flex-col p-5 mt-2.5 bg-white rounded-lg border border-[#808080]">
        <div className="flex w-full items-center justify-between">
          <button className='relative flex items-center gap-2 border border-[#212121] px-4 py-2 rounded-xl cursor-pointer'>
            <div className="grid absolute bg-[#B3261E] place-items-center w-6 h-6 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
            <FaUser className='text-[#212121] size-[24px]' />
            <span className='text-[#212121] text-sm font-medium'>Individual</span>
          </button>

          <button className='relative flex items-center gap-2 cursor-pointer'>
            <div className="grid absolute bg-[#B3261E] place-items-center w-5 h-5 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
            <FaUsers className='text-[#808080] size-[32px]' />
          </button>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-6 bg-white mt-2.5 rounded-lg border border-[#808080]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Topics</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors will-change-transform">
            <div>
              <p className="font-medium text-gray-900">#Technology</p>
              <p className="text-sm text-gray-500">12.5k posts</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors will-change-transform">
            <div>
              <p className="font-medium text-gray-900">#Design</p>
              <p className="text-sm text-gray-500">8.2k posts</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors will-change-transform">
            <div>
              <p className="font-medium text-gray-900">#Programming</p>
              <p className="text-sm text-gray-500">15.7k posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Who to Follow */}
      <div className="p-6 mt-2.5 bg-white rounded-lg border border-[#808080]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Who to Follow</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors will-change-transform">
            <img
              src="/perimg.png"
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">John Doe</p>
              <p className="text-sm text-gray-500">@johndoe</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
              Follow
            </button>
          </div>
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors will-change-transform">
            <img
              src="/perimg.png"
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Jane Smith</p>
              <p className="text-sm text-gray-500">@janesmith</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
              Follow
            </button>
          </div>
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors will-change-transform">
            <img
              src="/perimg.png"
              alt="User avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Tech News</p>
              <p className="text-sm text-gray-500">@technews</p>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chatbox
