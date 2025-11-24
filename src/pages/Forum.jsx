import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const Forum = () => {
  const [activeTab, setActiveTab] = useState('Members')
  const [selectedLetter, setSelectedLetter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample member data matching the image
  const members = [
    { id: 1, name: 'Buy Verified Coinbase Accounts', joined: '1 m', lastVisit: 'now', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 2, name: 'Cecil Manor', joined: '5 m', lastVisit: '5 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 3, name: 'Матвей Шаров', joined: '16 m', lastVisit: '15 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 4, name: 'sarkari yojana', joined: '17 m', lastVisit: '15 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 5, name: 'Domingo Ruiz', joined: '18 m', lastVisit: '18 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 6, name: 'prasanna Amale', joined: '18 m', lastVisit: 'now', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 7, name: 'ffffffff fffffffffff', joined: '19 m', lastVisit: '19 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 8, name: 'Марк Фомин', joined: '27 m', lastVisit: '27 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 9, name: 'clyde RINALDO', joined: '33 m', lastVisit: '24 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
    { id: 10, name: 'Тимур Степанов', joined: '41 m', lastVisit: '40 m', posts: 0, referrals: 0, avatar: '/perimg.png' },
  ]

  const tabs = ['Browse Forum', 'Members', 'My Threads', 'My Messages']
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLetter = selectedLetter === '' || member.name.charAt(0).toUpperCase() === selectedLetter
    return matchesSearch && matchesLetter
  })

  return (
    <div className="min-h-screen bg-[#EDF6F9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">Forum</h1>
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border">
            <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center">
              <span className="text-pink-600 text-sm font-semibold">👤</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 cursor-pointer rounded-full font-medium transition-all duration-300 ${activeTab === tab
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Icon - positioned to the right */}
          <div className="float-right -mt-12 mr-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-700 transition-colors">
              <FaSearch className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="clear-both"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'Members' && (
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#808080] p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-black mb-6">List of users</h2>

              {/* Alphabetical Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(selectedLetter === letter ? '' : letter)}
                    className={`w-8 h-8 text-sm font-medium rounded-full transition-all duration-300 ${selectedLetter === letter
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-300'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                      }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Joined</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Last visit</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Posts count</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Referrals</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <tr key={member.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                              <span className="text-orange-600 text-sm font-semibold">👤</span>
                            </div>
                            <span className="text-gray-700 font-medium">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{member.joined}</td>
                        <td className="py-4 px-4 text-gray-600">{member.lastVisit}</td>
                        <td className="py-4 px-4 text-gray-600">{member.posts}</td>
                        <td className="py-4 px-4 text-gray-600">{member.referrals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Load More Button */}
              <div className="text-center mt-8">
                <button className="px-6 py-3 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                  + Load more users
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Browse Forum' && (
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#808080] p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-black mb-6">Browse Forum</h2>
              <p className="text-gray-600">Forum categories and discussions will be displayed here.</p>
            </div>
          )}

          {activeTab === 'My Threads' && (
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#808080] p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-black mb-6">My Threads</h2>
              <p className="text-gray-600">Your forum threads will be displayed here.</p>
            </div>
          )}

          {activeTab === 'My Messages' && (
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#808080] p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-black mb-6">My Messages</h2>
              <p className="text-gray-600">Your forum messages will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Forum