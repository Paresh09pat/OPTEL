import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { baseUrl } from '../../utils/constant'
import Loader from '../loading/Loader'
import Avatar from '../Avatar'

const ForumMembers = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [selectedLetter, setSelectedLetter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const searchTimeoutRef = useRef(null)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Fetch members from API
  const fetchMembers = useCallback(async (page = 1, search = '', letter = '') => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("access_token")
      
      const params = {
        per_page: 12,
        page: page
      }

      // Add search parameter if search query exists
      if (search.trim()) {
        params.search = search.trim()
      }

      const response = await axios.get(
        `${baseUrl}/api/v1/forums/members`,
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
      if (data?.ok === true && Array.isArray(data.data)) {
        let filteredData = data.data

        // Apply letter filter on client side if selected
        if (letter) {
          filteredData = filteredData.filter(member => {
            const fullName = member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim()
            return fullName.charAt(0).toUpperCase() === letter
          })
        }

        if (page === 1) {
          setMembers(filteredData)
        } else {
          setMembers(prev => [...prev, ...filteredData])
        }
        setPagination(data.meta || null)
      } else {
        setMembers([])
      }
    } catch (error) {
      console.error('Error fetching forum members:', error)
      toast.error(error?.response?.data?.message || 'Failed to load forum members')
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Load members on component mount
  useEffect(() => {
    fetchMembers(1, '', '')
  }, [fetchMembers])

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // If search query is empty and no letter selected, fetch all members
    if (!searchQuery.trim() && !selectedLetter) {
      fetchMembers(1, '', '')
      return
    }

    // Set loading state immediately when typing
    if (searchQuery.trim()) {
      setLoading(true)
    }

    // Debounce the search API call
    searchTimeoutRef.current = setTimeout(() => {
      fetchMembers(1, searchQuery, selectedLetter)
    }, 500) // 500ms debounce delay

    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, selectedLetter, fetchMembers])

  // Load more members
  const loadMoreMembers = () => {
    if (pagination && pagination.current_page < pagination.last_page && !loading) {
      fetchMembers(pagination.current_page + 1, searchQuery, selectedLetter)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#808080] p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-black mb-6">Forum Members</h2>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members by name or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Alphabetical Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedLetter('')}
          className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
            selectedLetter === ''
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-300'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
          }`}
        >
          All
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(selectedLetter === letter ? '' : letter)}
            className={`w-8 h-8 text-sm font-medium rounded-full transition-all duration-300 ${
              selectedLetter === letter
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-300'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Members Table */}
      {loading && members.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No members found</p>
          <p className="text-gray-400 text-sm mt-2">
            {searchQuery || selectedLetter ? 'Try adjusting your filters' : 'No members available'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Member</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Username</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Posts</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-500 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr 
                    key={member.user_id} 
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={member.avatar ? `https://admin.ouptel.in/${member.avatar}` : member.avatar_url}
                          name={member.name || `${member.first_name} ${member.last_name}`}
                          email={member.username}
                          size="md"
                          alt={member.name}
                        />
                        <div className="flex flex-col">
                          <span className="text-gray-700 font-medium">
                            {member.name || `${member.first_name} ${member.last_name}`}
                          </span>
                          {member.verified && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">@{member.username}</td>
                    <td className="py-4 px-4 text-gray-600">{member.forum_posts || 0}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info and Load More Button */}
          {pagination && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing {members.length} of {pagination.total} members
                {(searchQuery || selectedLetter) && ' (filtered)'}
              </p>
              
              {pagination.current_page < pagination.last_page && (
                <button
                  onClick={loadMoreMembers}
                  disabled={loading}
                  className="px-6 py-3 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </span>
                  ) : (
                    `+ Load more members`
                  )}
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ForumMembers
