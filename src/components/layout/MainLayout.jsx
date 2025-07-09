import React, { useState } from 'react'
import SideMenu from './SideMenu'
import { FaBars, FaBell, FaPlus, FaSearch, FaTimes, FaUser, FaUsers } from 'react-icons/fa'
import { CiCircleMore } from 'react-icons/ci'
import { BiBell } from 'react-icons/bi'

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="h-screen bg-white overflow-hidden overflow-x-auto scrollbar-hide stable-layout">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between relative z-50 h-16">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center will-change-transform"
        >
          {isSidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>
        <div className="flex items-center">
          <img src="/logo.png" alt="Optel Logo" className="h-8" />
        </div>
        <div className="w-9"></div> {/* Spacer for centering */}
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 will-change-transform"
          onClick={closeSidebar}
        />
      )}

      <div className="flex h-full lg:h-screen">
        {/* Desktop Left Sidebar - Fixed */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0 fixed left-0 top-0 h-full z-30 stable-layout">
          <SideMenu />
        </div>

        {/* Mobile Sidebar - Full Width */}
        <div className={`lg:hidden fixed left-0 top-0 h-full w-full transform transition-transform duration-300 ease-in-out z-50 will-change-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <SideMenu onClose={closeSidebar} isMobile={true} />
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 lg:ml-80 lg:mr-80 xl:mr-80 h-full lg:h-screen lg:pt-0 overflow-y-auto scrollbar-hide smooth-scroll">
          {children}
        </main>

        {/* Desktop Right Sidebar - Fixed */}
        <div className=" bg-[#EDF6F9] pr-1 lg:block lg:w-80  flex-shrink-0 fixed right-0 top-0 h-full z-30  overflow-y-auto scrollbar-hide smooth-scroll stable-layout">
          {/* Trending Section */}
          <div className="w-full p-3 rounded-lg bg-white shadow-[#EDF6F9] shadow-md border border-[#808080]">
            <div className="flex p-4 items-center justify-between">
            <div className=" relative w-[58px] h-[58px] rounded-full bg-[#EDF6F9] border-[4px]  border-inset border-[#ffffff] shadow-md shadow-fuchsia-400 ">
              <div className="grid place-items-center  absolute -right-1 -bottom-1 bg-black w-5 h-5 rounded-full border-inset border-[2px] shadow-2xl shadow-fuchsia-400 border-white">
          <FaPlus className='text-white size-[10px]' />
              </div>
            </div>

          <div className="flex items-center justify-center gap-4 ">
          <svg xmlns="http://www.w3.org/2000/svg" className='text-gray-500 size-[25px] cursor-pointer' width={24} height={24} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth={2}><circle cx={11} cy={11} r={7}></circle><path strokeLinecap="round" d="M11 8a3 3 0 0 0-3 3m12 9l-3-3"></path></g></svg>
          <BiBell className='text-gray-500 size-[25px] cursor-pointer' />
          <CiCircleMore className='text-gray-500 size-[25px] cursor-pointer' />
            <input type="text" placeholder='Search' className='text-gray-500 text-sm outline-none ml-2 w-full bg-transparent hidden transition-colors duration-300 rounded-md p-2' />

          </div>

            </div>

          </div>

          <div className="flex flex-col p-5 mt-2.5 bg-white rounded-lg border border-[#808080]">
           <div className="flex w-full items-center justify-between">
            <button className=' relative flex items-center gap-2 border border-[#212121] px-4 py-2 rounded-xl cursor-pointer'>
              <div className="grid absolute bg-[#B3261E] place-items-center w-6 h-6 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
              <FaUser className='text-[#212121] size-[24px]' />
              <span className='text-[##212121] text-sm font-medium'>Individual</span>
            </button>

            <button className=' relative flex items-center gap-2 cursor-pointer '>
            <div className="grid absolute bg-[#B3261E] place-items-center w-5 h-5 rounded-full -right-2 -top-2 text-[10px] text-white font-medium">2</div>
              <FaUsers className='text-[#808080] size-[32px]' />
              
            </button>
           </div>
          </div>
          <div className="p-6 border-b border-gray-200">
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
          <div className="p-6">
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
      </div>
    </div>
  )
}

export default MainLayout
