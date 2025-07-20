// src/components/layout/SideMenu.js
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEllipsisV, FaTimes } from 'react-icons/fa'
import { Icon } from '@iconify/react'
import { navigationItems } from '../../constants/navigation'

const SideMenu = ({ onClose, isMobile = false }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose()
    }
  }

  return (
    <div className={`${isMobile ? 'w-full' : 'w-60 xl:w-80'} h-screen bg-[#EDF6F9] flex flex-col`}>
      {/* Logo Section */}
      <div className="p-1 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center justify-center space-x-3 flex-1">
          <img src="/logo.png" alt="Optel Logo" className="w-[250px] h-20" />
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-4 pt-[19px] pb-0 overflow-y-auto scrollbar-hide">
        <nav className="">
          {navigationItems.map((item) => {
            const active = isActive(item.path)

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-4 py-2 px-7 rounded-lg transition-colors duration-200 ${active
                  ? 'bg-white border border-[#808080]'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <div
                  className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <span
                  className={`font-medium text-lg truncate ${active ? 'text-blue-600' : 'text-gray-700'
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

      <button
        onClick={handleLinkClick}
        className="  bg-transparent  text-[#212121] font-semibold text-xl py-3.5 px-6 rounded-full flex items-center justify-between transition-colors cursor-pointer border border-[#808080] mx-auto w-full"
      >
        <span>Create post</span>
        <Icon icon="lets-icons:send-hor-light" width="30" height="30" style={{ color: '#000' }} />
      </button>

      {/* User Profile Section */}
      <div className="px-4 py-1 mt-5">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <img
            src="/perimg.png"
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover"
            onClick={() => {
              navigate('/profile')
            }}
          />
          <div className="flex-1" onClick={() => {
            navigate('/profile')
          }}>
            <p className="font-semibold text-gray-900">John Doe</p>
            <p className="text-sm text-gray-500">@johndoe</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <FaEllipsisV className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideMenu
