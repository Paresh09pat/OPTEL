// src/components/layout/SideMenu.js
import React, { useState, useRef, useEffect } from 'react'
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef(null)
  
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileMenuOpen])

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
            src={userData?.avatar_url || "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80"}
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover"
            onClick={() => {
              navigate('/profile')
            }}
            onError={(e) => {
              e.target.src = "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg?semt=ais_hybrid&w=740&q=80";
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
          <div className="relative" ref={profileMenuRef}>
            <button 
              className={`text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors ${profileMenuOpen ? 'bg-gray-100 text-gray-600' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setProfileMenuOpen((prev) => !prev)
              }}
              aria-label="Open profile options"
            >
              <FaEllipsisV className="text-sm" />
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-[#d3d1d1] rounded-lg shadow-lg z-50 py-2">
                <button
                  onClick={() => {
                    navigate('/profile')
                    setProfileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/profile-settings')
                    setProfileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/profile-settings')
                    setProfileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <div className="border-t border-gray-200 my-1" />
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Night Mode
                </button>
                <div className="border-t border-gray-200 my-1" />
                <button
                  onClick={() => {
                    handleLogout()
                    setProfileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu
