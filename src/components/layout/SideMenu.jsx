import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowRight, FaEllipsisV, FaTimes } from 'react-icons/fa'
import { navigationItems } from '../../constants/navigation'

const SideMenu = ({ onClose, isMobile = false }) => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <div className={`${isMobile ? 'w-full' : 'w-80'} h-screen bg-[#EDF6F9] flex flex-col shadow-lg stable-layout`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center justify-center space-x-3 flex-1">
          <img src="/logo.png" alt="Optel Logo" className="w-auto h-15" />
        </div>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors lg:hidden will-change-transform"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide smooth-scroll">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 will-change-transform ${
                  active
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div
                  className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 will-change-transform`}
                >
                  <IconComponent className="text-white text-lg" />
                </div>
                <span
                  className={`font-medium truncate ${
                    active ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Create Post Button */}
      <div className="px-4 py-4">
        <button 
          onClick={handleLinkClick}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-full flex items-center justify-between transition-colors duration-200 will-change-transform"
        >
          <span>Create post</span>
          <FaArrowRight className="text-sm" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors will-change-transform">
          <img
            src="/perimg.png"
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900">John Doe</p>
            <p className="text-sm text-gray-500">@johndoe</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600 will-change-transform">
            <FaEllipsisV className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideMenu 