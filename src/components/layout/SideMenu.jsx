import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaArrowRight, FaEllipsisV } from 'react-icons/fa'
import { navigationItems } from '../../constants/navigation'

const SideMenu = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="w-80 h-screen bg-gray-50 flex flex-col shadow-lg">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-3">
          <img src="/logo.png" alt="Optel Logo" className="w-auto h-15" />

        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
  <nav className="space-y-2">
    {navigationItems.map((item) => {
      const IconComponent = item.icon
      const active = isActive(item.path)

      return (
        <Link
          key={item.id}
          to={item.path}
          className={`flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 ${
            active
              ? 'bg-blue-50 border-l-4 border-blue-500'
              : 'hover:bg-gray-100'
          }`}
        >
          <div
            className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}
          >
            <IconComponent className="text-white text-lg" />
          </div>
          <span
            className={`font-medium ${
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
        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-full flex items-center justify-between transition-colors duration-200">
          <span>Create post</span>
          <FaArrowRight className="text-sm" />
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://via.placeholder.com/40x40/6B7280/FFFFFF?text=AS"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-gray-800">Aman Shaikh</p>
              <p className="text-sm text-gray-500">@_amu_456</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <FaEllipsisV />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideMenu 