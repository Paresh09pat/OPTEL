import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaUsers, FaComments, FaLock, FaLockOpen } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'react-toastify'
import { baseUrl } from '../utils/constant'
import Loader from '../components/loading/Loader'
import SuggestedForums from '../components/SuggestedForums'
import ForumMembers from '../components/specific/ForumMembers'

const Forum = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Browse Forum')
  const [searchQuery, setSearchQuery] = useState('')
  const [forums, setForums] = useState([])
  const [loading, setLoading] = useState(false)
  const [forumsLoading, setForumsLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [forumType, setForumType] = useState('all')
  const [forumSearchQuery, setForumSearchQuery] = useState('')
  const searchTimeoutRef = useRef(null)

  const tabs = ['Browse Forum', 'Suggested Forums', 'Members', 'My Threads', 'My Messages']

  // Fetch forums
  const fetchForums = useCallback(async (page = 1, type = 'all', searchQuery = '') => {
    setForumsLoading(true)
    try {
      const accessToken = localStorage.getItem("access_token")
      
      // Use search endpoint if there's a search query, otherwise use regular forums endpoint
      const endpoint = searchQuery.trim() 
        ? `${baseUrl}/api/v1/forums/search`
        : `${baseUrl}/api/v1/forums`
      
      const params = searchQuery.trim()
        ? {
            q: searchQuery.trim(),
            per_page: 12,
            page: page
          }
        : {
            type: type,
            per_page: 12,
            page: page
          }

      const response = await axios.get(
        endpoint,
        {
          params: params,
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

  // Load forums when Browse Forum tab is active or forum type changes
  useEffect(() => {
    // Only fetch if we're on Browse Forum tab and there's no active search
    if (activeTab === 'Browse Forum' && !forumSearchQuery.trim()) {
      fetchForums(1, forumType, '')
    }
  }, [activeTab, forumType, fetchForums, forumSearchQuery])

  // Debounced search effect - only for search queries
  useEffect(() => {
    // Only handle search queries, not empty strings
    if (!forumSearchQuery.trim()) {
      return
    }

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set loading state immediately
    setForumsLoading(true)

    // Debounce the search API call
    searchTimeoutRef.current = setTimeout(() => {
      if (activeTab === 'Browse Forum') {
        fetchForums(1, forumType, forumSearchQuery)
      }
    }, 500) // 500ms debounce delay

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [forumSearchQuery, activeTab, forumType, fetchForums])

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
      fetchForums(pagination.current_page + 1, forumType, forumSearchQuery)
    }
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">Forum</h1>
          {/* <button
            onClick={() => navigate('/forum/create')}
            className="border border-[#808080] py-1.5 px-4 rounded-2xl flex items-center gap-2 text-[#808080] text-base font-medium cursor-pointer hover:bg-gray-100 transition"
          >
            Create Forum
          </button> */}
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

         
          <div className="clear-both"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'Suggested Forums' && (
            <SuggestedForums />
          )}

          {activeTab === 'Members' && (
            <ForumMembers />
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
                      setForumSearchQuery('') // Clear search when changing filter
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
                      onChange={(e) => {
                        setForumSearchQuery(e.target.value)
                        setForums([]) // Clear forums while typing
                      }}
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
              ) : forums.length === 0 ? (
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
                    {forums.map((forum) => (
                      <div
                        key={forum.id}
                        onClick={() => navigate(`/forum/${forum.id}`)}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 cursor-pointer flex flex-col h-full"
                      >
                        {/* Forum Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{forum.name}</h3>
                            {forum.description ? (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {forum.description}
                              </p>
                            ) : (
                              <p className="text-gray-400 text-sm line-clamp-2 h-10"></p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                          {forum.privacy === 'private' && (
                              <FaLock className="w-5 h-5 text-gray-400" />
                          )}
                          {forum.privacy === 'public' && (
                              <FaLockOpen className="w-5 h-5 text-gray-400" />
                          )}
                          </div>
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

                        {/* Owner Badge - Only show if user is owner */}
                        <div className="mt-auto pt-3">
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