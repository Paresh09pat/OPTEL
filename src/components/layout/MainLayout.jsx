import React, { useState } from 'react'
import SideMenu from './SideMenu'
import { FaBars, FaTimes } from 'react-icons/fa'

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
        <div className="hidden lg:block lg:w-80 bg-white flex-shrink-0 fixed right-0 top-0 h-full z-30 border-l border-gray-200 overflow-y-auto scrollbar-hide smooth-scroll stable-layout">
          {/* Trending Section */}
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
