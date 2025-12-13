import React, { useState, useEffect, useCallback } from 'react'
import { FaSearch, FaUsers, FaComments, FaLock, FaLockOpen, FaUser } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'
import { baseUrl } from '../utils/constant'
import Loader from '../components/loading/Loader'
import Avatar from '../components/Avatar'

const Forum = () => {
  const [activeTab, setActiveTab] = useState('Browse Forum')
  const [selectedLetter, setSelectedLetter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [forums, setForums] = useState([])
  const [loading, setLoading] = useState(false)
  const [forumsLoading, setForumsLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [forumType, setForumType] = useState('all')
  const [forumSearchQuery, setForumSearchQuery] = useState('')

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

  // Fetch forums
  const fetchForums = useCallback(async (page = 1, type = 'all') => {
    setForumsLoading(true)
    try {
      const accessToken = localStorage.getItem("access_token")
      const response = await axios.get(
        `${baseUrl}/api/v1/forums`,
        {
          params: {
            type: type,
            per_page: 12,
            page: page
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      )

      const data = response.data
      if (data?.data && Array.isArray(data.data)) {
        if (page === 1) {
          setForums(data.data)
        } else {
          setForums(prev => [...prev, ...data.data])
        }
        setPagination(data.meta || null)
      } else if (Array.isArray(data)) {
        // Handle case where response is directly an array
        if (page === 1) {
          setForums(data)
        } else {
          setForums(prev => [...prev, ...data])
        }
      } else {
        setForums([])
      }
    } catch (error) {
      console.error('Error fetching forums:', error)
      toast.error(error?.response?.data?.message || 'Failed to load forums')
      setForums([])
    } finally {
      setForumsLoading(false)
    }
  }, [])

  // Load forums when Browse Forum tab is active
  useEffect(() => {
    if (activeTab === 'Browse Forum') {
      fetchForums(1, forumType)
    }
  }, [activeTab, forumType, fetchForums])

  // Handle join/leave forum
  const handleJoinForum = async (forumId, isJoined) => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("access_token")
      const endpoint = isJoined 
        ? `${baseUrl}/api/v1/forums/${forumId}/leave`
        : `${baseUrl}/api/v1/forums/${forumId}/join`
      
      const method = isJoined ? 'delete' : 'post'
      
      const response = await axios[method](
        endpoint,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
          }
        }
      )

      const data = response.data
      if (data?.ok === true || data?.api_status === 200) {
        // Update forum join status
        setForums(prev => prev.map(forum => 
          forum.id === forumId 
            ? { 
                ...forum, 
                is_joined: !isJoined,
                members_count: isJoined 
                  ? Math.max(0, (forum.members_count || 0) - 1)
                  : (forum.members_count || 0) + 1
              }
            : forum
        ))
        toast.success(isJoined ? 'Left forum successfully' : 'Joined forum successfully')
      } else {
        toast.error(data?.message || 'Failed to update forum membership')
      }
    } catch (error) {
      console.error('Error joining/leaving forum:', error)
      toast.error(error?.response?.data?.message || 'Failed to update forum membership')
    } finally {
      setLoading(false)
    }
  }

  // Load more forums
  const loadMoreForums = () => {
    if (pagination && pagination.current_page < pagination.last_page && !forumsLoading) {
      fetchForums(pagination.current_page + 1, forumType)
    }
  }

  // Filter forums by search query
  const filteredForums = forums.filter(forum => {
    if (!forumSearchQuery.trim()) return true
    const query = forumSearchQuery.toLowerCase()
    return (
      forum.name?.toLowerCase().includes(query) ||
      forum.description?.toLowerCase().includes(query) ||
      forum.owner?.username?.toLowerCase().includes(query)
    )
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-black">Browse Forum</h2>
                
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Forum Type Filter */}
                  <select
                    value={forumType}
                    onChange={(e) => {
                      setForumType(e.target.value)
                      setForums([])
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Forums</option>
                    <option value="suggested">Suggested Forums</option>
                    <option value="joined">Joined Forums</option>
                    <option value="my_forums">My Forums</option>
                  </select>

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search forums..."
                      value={forumSearchQuery}
                      onChange={(e) => setForumSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {forumsLoading && forums.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <Loader />
                </div>
              ) : filteredForums.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {forumSearchQuery ? 'No forums match your search' : 'No forums available'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {forumSearchQuery ? 'Try a different search term' : 'Check back later for new forums'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {filteredForums.map((forum) => (
                      <div
                        key={forum.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                      >
                        {/* Forum Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{forum.name}</h3>
                            {forum.description && (
                              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {forum.description}
                              </p>
                            )}
                          </div>
                          {forum.privacy === 'private' && (
                            <FaLock className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                          {forum.privacy === 'public' && (
                            <FaLockOpen className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                          )}
                        </div>

                        {/* Forum Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FaComments className="w-4 h-4" />
                            <span>{forum.topics_count || 0} Topics</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaUsers className="w-4 h-4" />
                            <span>{forum.members_count || 0} Members</span>
                          </div>
                        </div>

                        {/* Forum Owner */}
                        {forum.owner && (
                          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                            <Avatar
                              src={forum.owner.avatar_url}
                              name={forum.owner.username || 'Unknown'}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Created by</p>
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {forum.owner.username || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Join/Leave Button */}
                        <button
                          onClick={() => handleJoinForum(forum.id, forum.is_joined)}
                          disabled={loading}
                          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                            forum.is_joined
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                              Processing...
                            </span>
                          ) : forum.is_joined ? (
                            'Leave Forum'
                          ) : (
                            'Join Forum'
                          )}
                        </button>

                        {/* Privacy Badge */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            forum.privacy === 'public'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {forum.privacy === 'public' ? 'Public' : 'Private'}
                          </span>
                          {forum.is_owner && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                              Owner
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {pagination && pagination.current_page < pagination.last_page && (
                    <div className="text-center mt-8">
                      <button
                        onClick={loadMoreForums}
                        disabled={forumsLoading}
                        className="px-6 py-3 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {forumsLoading ? (
                          <span className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                            Loading...
                          </span>
                        ) : (
                          `+ Load more forums (${pagination.total - forums.length} remaining)`
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
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