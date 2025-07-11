import React, { useState } from 'react'
import SideMenu from './SideMenu'
import Chatbox from '../specific/Chatbox'
import { FaBars, FaTimes, FaCommentDots } from 'react-icons/fa'
import { PiChatCircleTextFill } from "react-icons/pi";


const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen)
  }

  const closeRightSidebar = () => {
    setIsRightSidebarOpen(false)
  }

  return (
    <div className="h-screen bg-white overflow-hidden scrollbar-hide stable-layout">
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
        <button
          onClick={toggleRightSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center will-change-transform"
        >
          {isRightSidebarOpen ? <FaTimes className="w-5 h-5" /> : <PiChatCircleTextFill className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {(isSidebarOpen || isRightSidebarOpen) && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 will-change-transform"
          onClick={() => {
            closeSidebar()
            closeRightSidebar()
          }}
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

        {/* Mobile Right Sidebar - Full Width */}
        <div className={`lg:hidden fixed right-0 top-0 h-full w-full transform transition-transform duration-300 ease-in-out z-50 will-change-transform ${
          isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <Chatbox onClose={closeRightSidebar} isMobile={true} />
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 mr-0 lg:ml-80 lg:mr-90 xl:mr-90 h-full lg:h-screen lg:pt-0 overflow-y-auto scrollbar-hide smooth-scroll">
          {children}
        </main>

        {/* Desktop Right Sidebar - Fixed */}
        <div className="hidden lg:block lg:w-90 flex-shrink-0 fixed right-0 top-0 h-full z-30">
          <Chatbox />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
