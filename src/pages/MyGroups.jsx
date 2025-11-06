import React, { useState, useEffect } from "react";
import { FiPlus, FiCheck } from "react-icons/fi";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import CreateGroupForm from "./CreateGroupForm";
import { HiUsers } from "react-icons/hi";
import axios from "axios";

const MyGroups = () => {
  const [activeTab, setActiveTab] = useState("myGroups");
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Fetch suggested groups from API
  const fetchSuggestedGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/groups?type=suggested`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setSuggestedGroups(response.data.data);
      } else {
        setSuggestedGroups([]);
      }
    } catch (err) {
      console.error("Error fetching suggested groups:", err);
      setError("Failed to load suggested groups. Please try again.");
      setSuggestedGroups([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my groups from API
  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/groups`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setMyGroups(response.data.data);
      } else {
        setMyGroups([]);
      }
    } catch (err) {
      console.error("Error fetching my groups:", err);
      setError("Failed to load my groups. Please try again.");
      setMyGroups([]);
    } finally {
      setLoading(false);
    }
  };

  // Load groups when component mounts or when tab is selected
  useEffect(() => {
    if (activeTab === "suggested") {
      fetchSuggestedGroups();
    } else if (activeTab === "myGroups") {
      fetchMyGroups();
    }
  }, [activeTab]);

  // Handle dropdown toggle
  const handleDropdownToggle = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  // Handle joining a group
  const handleJoinGroup = async (groupId) => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/groups/${groupId}/join`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data && response.data.api_status === "200") {
        // Update the group's is_joined status
        setSuggestedGroups((prev) =>
          prev.map((group) =>
            group.id === groupId
              ? {
                  ...group,
                  is_joined: true,
                  members_count: group.members_count + 1,
                }
              : group
          )
        );
        // You can add a toast notification here
        console.log("Successfully joined the group");
      }
    } catch (err) {
      console.error("Error joining group:", err);
      // You can add error toast notification here
    } finally {
      setLoading(false);
    }
  };

  const groups = {
    myGroups: [
      {
        id: 1,
        name: "Flutter",
        members: "250+ Members",
        logo: "🦋",
      },
      {
        id: 2,
        name: "React",
        members: "250+ Members",
        logo: "⚛️",
      },
    ],
    suggested: [
      {
        id: 3,
        name: "feeluiuxmagic",
        subtitle: "UI Designing & UX",
        members: "2K+ Members",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        logo: "🎨",
      },
      {
        id: 4,
        name: "Java_tech",
        subtitle: "Tech & IT",
        members: "2.3K+ Members",
        image:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        logo: "☕",
      },
    ],
    joined: [
      {
        id: 5,
        name: "MERN Stack",
        members: "250+ Members",
        image:
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        logo: "🦋",
      },
      {
        id: 6,
        name: "React Native",
        members: "250+ Members",
        image:
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
        logo: "⚛️",
      },
    ],
  };

  const getCurrentGroups = () => {
    if (activeTab === "myGroups") return myGroups;
    if (activeTab === "suggested") return suggestedGroups;
    return groups.joined;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        {!createGroupModal && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900">
                My Groups
              </h1>
              <button
                onClick={() => setCreateGroupModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FiPlus className="w-5 h-5" />
                <span className="font-medium">Create Group</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setActiveTab("myGroups")}
                className={`px-6 py-3 cursor-pointer rounded-full font-medium transition-all duration-300 ${
                  activeTab === "myGroups"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-300"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
              >
                My Groups
              </button>
              <button
                onClick={() => setActiveTab("suggested")}
                className={`px-6 py-3 rounded-full cursor-pointer font-medium transition-all duration-300 ${
                  activeTab === "suggested"
                    ? "bg-[#1356e9] text-white shadow-lg shadow-[#1356e9]"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
              >
                Suggested Groups
              </button>
              <button
                onClick={() => setActiveTab("joined")}
                className={`px-6 py-3 cursor-pointer rounded-full font-medium transition-all duration-300 ${
                  activeTab === "joined"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-300"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
              >
                Joined Groups
              </button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(activeTab === "suggested" && loading) ||
              (activeTab === "myGroups" && loading) ? (
                // Loading state for groups
                <div className="col-span-full flex justify-center items-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600">
                      {activeTab === "suggested"
                        ? "Loading suggested groups..."
                        : "Loading my groups..."}
                    </p>
                  </div>
                </div>
              ) : (activeTab === "suggested" && error) ||
                (activeTab === "myGroups" && error) ? (
                // Error state for groups
                <div className="col-span-full flex justify-center items-center py-16">
                  <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={
                        activeTab === "suggested"
                          ? fetchSuggestedGroups
                          : fetchMyGroups
                      }
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : activeTab === "myGroups" ? (
                getCurrentGroups().map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#808080] overflow-hidden"
                  >
                    <div className="py-3.5 pl-6 pr-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Group Logo */}
                          <div className="w-20 h-20 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center shadow-md shadow-[#00000040] overflow-hidden">
                            {group.avatar_url ? (
                              <img
                                src={group.avatar_url}
                                alt={group.group_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-3xl sm:text-4xl">👥</span>
                            )}
                          </div>

                          {/* Group Info */}
                          <div>
                            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1">
                              {group.group_name || "Unnamed Group"}
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                              {group.members_count || 0} Members
                            </p>
                          </div>
                        </div>

                        {/* Dropdown Arrow */}
                        <button
                          onClick={() => handleDropdownToggle(group.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          {expandedGroup === group.id ? (
                            <IoIosArrowDropup className="w-6 h-6 text-gray-600 hover:text-blue-500" />
                          ) : (
                            <IoIosArrowDropdown className="w-6 h-6 text-gray-600 hover:text-blue-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Dropdown Details */}
                    {expandedGroup === group.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <div className="space-y-4">
                          {/* Group Description */}
                          {group.about && group.about.trim() && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                About
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {group.about}
                              </p>
                            </div>
                          )}

                          {/* Group Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Privacy
                              </h4>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  group.privacy === "public"
                                    ? "bg-green-100 text-green-800"
                                    : group.privacy === "private"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {group.privacy
                                  ? group.privacy.charAt(0).toUpperCase() +
                                    group.privacy.slice(1)
                                  : "Unknown"}
                              </span>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Join Privacy
                              </h4>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  group.join_privacy === "public"
                                    ? "bg-green-100 text-green-800"
                                    : group.join_privacy === "private"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {group.join_privacy
                                  ? group.join_privacy.charAt(0).toUpperCase() +
                                    group.join_privacy.slice(1)
                                  : "Unknown"}
                              </span>
                            </div>
                          </div>

                          {/* Owner Info */}
                          {group.owner && group.owner.username && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Owner
                              </h4>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img
                                    src={
                                      group.owner.avatar_url ||
                                      "https://66.116.199.195/images/placeholders/user-avatar.svg"
                                    }
                                    alt={group.owner.username}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-gray-600 text-sm">
                                  @{group.owner.username}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : activeTab === "suggested" ? (
                getCurrentGroups().map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#000000] overflow-hidden"
                  >
                    {/* Header with Logo and Title */}
                    <div className="p-4 sm:p-5 flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md shadow-[#00000040] flex-shrink-0 overflow-hidden`}
                      >
                        {group.avatar_url ? (
                          <img
                            src={group.avatar_url}
                            alt={group.group_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👥</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {group.group_name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {group.group_title}
                        </p>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                      <img
                        src={
                          group.cover_url ||
                          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                        }
                        alt={group.group_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Group Description */}
                    {group.about && (
                      <div className="p-4 sm:p-5 border-b border-gray-100">
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {group.about
                            .replace(/<br\s*\/?>/gi, " ")
                            .substring(0, 100)}
                          {group.about.length > 100 && "..."}
                        </p>
                      </div>
                    )}

                    {/* Footer with Members and Join Button */}
                    <div className="p-4 sm:p-5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <HiUsers className="w-5 h-5 text-[#3D8CFA]" />
                        <span className="font-semibold text-sm">
                          {group.members_count} Members
                        </span>
                      </div>
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={group.is_joined || loading}
                        className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-full border-2 transition-all duration-200 font-semibold ${
                          group.is_joined
                            ? "bg-green-50 text-green-600 border-green-600 cursor-not-allowed"
                            : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {group.is_joined ? (
                          <>
                            <FiCheck className="w-4 h-4" />
                            <span className="text-xs">Joined</span>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#3D8CFA"
                                d="M19 17v2H7v-2s0-4 6-4s6 4 6 4m-3-9a3 3 0 1 0-3 3a3 3 0 0 0 3-3m3.2 5.06A5.6 5.6 0 0 1 21 17v2h3v-2s0-3.45-4.8-3.94M18 5a2.9 2.9 0 0 0-.89.14a5 5 0 0 1 0 5.72A2.9 2.9 0 0 0 18 11a3 3 0 0 0 0-6M8 10H5V7H3v3H0v2h3v3h2v-3h3Z"
                              ></path>
                            </svg>
                            <span className="text-xs">Join Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                getCurrentGroups().map((group) => (
                  <div
                    key={group.id}
                    className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#000000] overflow-hidden"
                  >
                    {/* Header with Logo and Title */}
                    <div className="p-4 sm:p-5 flex items-center gap-3">
                      <div
                        className={`w-12 h-12   rounded-full flex items-center justify-center shadow-md shadow-[#00000040] flex-shrink-0`}
                      >
                        <span className="text-2xl">{group.logo}</span>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                          {group.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {group.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Footer with Members and Join Button */}
                    <div className="p-4 sm:p-5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <HiUsers className="w-5 h-5 text-[#3D8CFA]" />
                        <span className="font-semibold text-sm">
                          {group.members}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Empty State */}
            {getCurrentGroups().length === 0 && !loading && !error && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  No groups found in this section.
                </p>
              </div>
            )}
          </div>
        )}
        {createGroupModal && (
          <CreateGroupForm
            onClose={() => setCreateGroupModal(false)}
            onSuccess={(groupData) => {
              console.log("Group created:", groupData);
              // You can add logic here to refresh the groups list or show a notification
            }}
          />
        )}
      </div>
    </>
  );
};

export default MyGroups;
