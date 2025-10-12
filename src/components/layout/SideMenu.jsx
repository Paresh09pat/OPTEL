// src/components/layout/SideMenu.js
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEllipsisV, FaTimes } from 'react-icons/fa'
import { FiLogOut } from 'react-icons/fi'
import { Icon } from '@iconify/react'
import { navigationItems } from '../../constants/navigation'
import { useUser } from '../../context/UserContext'

const SideMenu = ({ onClose, isMobile = false }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userData, loading } = useUser()
  
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


  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('session_id')
    localStorage.removeItem('user_id')
    navigate('/login')
  }

  return (
    <div className={`${isMobile ? 'w-full' : 'w-60 xl:w-80'} h-screen bg-[#EDF6F9] flex flex-col`}>
      {/* Logo Section */}
      <div className="pt-3 border-b border-[#d3d1d1] flex items-center justify-between">
        <div className="flex items-center justify-center space-x-3 flex-1">
          <img src="/op_logo.png" alt="Optel Logo" className="w-[11rem] aspect-1" />
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
                className={`flex items-center space-x-2 py-1 px-7 rounded-lg transition-colors duration-200 ${active
                  ? 'bg-white border border-[#d3d1d1]'
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
        className="  bg-transparent  text-[#212121] font-semibold text-xl py-3.5 px-6 rounded-full flex items-center justify-between transition-colors cursor-pointer border border-[#d3d1d1] mx-auto w-[90%]"
      >
        <span>Create post</span>
        <Icon icon="lets-icons:send-hor-light" width="30" height="30" style={{ color: '#000' }} />
      </button>

      {/* User Profile Section */}
      <div className="px-4 py-1 mt-5">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <img
            src={userData?.avatar_url || "/perimg.png"}
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover"
            onClick={() => {
              navigate('/profile')
            }}
            onError={(e) => {
              e.target.src = "/perimg.png";
            }}
          />
          <div className="flex-1" onClick={() => {
            navigate('/profile')
          }}>
            <p className="font-semibold text-gray-900">
              {loading ? 'Loading...' : `${userData?.first_name || 'User'} ${userData?.last_name || ''}`}
            </p>
            <p className="text-sm text-gray-500">@{loading ? 'loading...' : userData?.username || 'username'}</p>
          </div>
          <div className="relative">
            <button 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaEllipsisV className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu
