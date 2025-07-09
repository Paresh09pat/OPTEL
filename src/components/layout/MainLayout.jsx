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
    <div className="h-screen bg-white overflow-hidden overflow-x-auto scrollbar-hide">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between relative z-50 h-16">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      <div className="flex h-full lg:h-screen">
        {/* Desktop Left Sidebar - Fixed */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0 fixed left-0 top-0 h-full z-30">
          <SideMenu />
        </div>

        {/* Mobile Sidebar - Full Width */}
        <div className={`lg:hidden fixed left-0 top-0 h-full w-full transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <SideMenu onClose={closeSidebar} isMobile={true} />
        </div>

        {/* Main Content - Scrollable */}
        <main className="flex-1 lg:ml-80 lg:mr-80 xl:mr-80 overflow-auto h-full lg:h-screen lg:pt-0">
          {children}
        </main>

        {/* Desktop Right Sidebar - Fixed */}
        <div className="hidden lg:block lg:w-80 bg-white flex-shrink-0 fixed right-0 top-0 h-full z-30 border-l border-gray-200 overflow-y-auto">
          {/* Trending Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Topics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">#Technology</p>
                  <p className="text-sm text-gray-500">12.5k posts</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">#Design</p>
                  <p className="text-sm text-gray-500">8.2k posts</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">#Programming</p>
                  <p className="text-sm text-gray-500">15.7k posts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who to Follow */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Who to Follow</h3>
            <div className="space-y-3">
              {[
                { name: 'Tech Innovator', username: '@techinnovator', followers: '45.2k' },
                { name: 'Design Guru', username: '@designguru', followers: '32.1k' },
                { name: 'Code Master', username: '@codemaster', followers: '28.9k' }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src="/perimg.png"
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.username}</p>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-700">New post from <span className="font-medium">@designguru</span></p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-700">Someone liked your post</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-700">New follower: <span className="font-medium">@codemaster</span></p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
