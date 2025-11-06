import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiMonitor, FiSmartphone } from "react-icons/fi";

const Managesession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Logout function to clear storage and navigate to login
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("refresh_token");

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear all cookies (if any)
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Navigate to login page
    navigate("/login");
  };

  // Fetch sessions from API
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/sessions`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                localStorage.getItem("access_token") || ""
              }`,
            },
          }
        );

        const data = response.data;

        if (data.api_status === "200") {
          setSessions(data.data || []);
        } else {
          throw new Error(data.api_text || "Failed to fetch sessions");
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setError("Failed to load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Delete individual session
  const handleDeleteSession = async (sessionId) => {
    // Find the session to check if it's current
    const sessionToDelete = sessions.find(
      (session) => session.id === sessionId
    );
    const isCurrentSession = sessionToDelete?.is_current;

    try {
      setDeleteLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/sessions/delete`,
        { id: sessionId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("access_token") || ""
            }`,
          },
        }
      );

      const data = response.data;

      if (data.api_status === "200") {
        // If deleting current session, logout user
        if (isCurrentSession) {
          handleLogout();
          return;
        }

        // Remove the deleted session from the list
        setSessions(sessions.filter((session) => session.id !== sessionId));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(data.api_text || "Failed to delete session");
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Failed to delete session. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Delete all sessions
  const handleDeleteAllSessions = async () => {
    if (
      !window.confirm(
        "Are you sure you want to logout from all sessions? This will log you out from all devices."
      )
    ) {
      return;
    }

    try {
      setDeleteAllLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/sessions/delete-all`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              localStorage.getItem("access_token") || ""
            }`,
          },
        }
      );

      const data = response.data;

      if (data.api_status === "200") {
        // Logout user since all sessions are deleted
        handleLogout();
      } else {
        throw new Error(data.api_text || "Failed to logout from all sessions");
      }
    } catch (err) {
      console.error("Error deleting all sessions:", err);
      setError("Failed to logout from all sessions. Please try again.");
    } finally {
      setDeleteAllLoading(false);
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform, device) => {
    const platformLower = platform.toLowerCase();
    const deviceLower = device.toLowerCase();

    if (platformLower.includes("windows") || deviceLower.includes("windows")) {
      return (
        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
          W
        </div>
      );
    } else if (
      platformLower.includes("android") ||
      deviceLower.includes("android")
    ) {
      return (
        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs">
          🤖
        </div>
      );
    } else if (
      platformLower.includes("ios") ||
      platformLower.includes("iphone") ||
      deviceLower.includes("iphone")
    ) {
      return (
        <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center text-white text-xs">
          📱
        </div>
      );
    } else if (platformLower.includes("mac") || deviceLower.includes("mac")) {
      return (
        <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs">
          🍎
        </div>
      );
    } else {
      return <FiMonitor className="w-6 h-6 text-gray-500" />;
    }
  };

  // Get platform display name
  const getPlatformName = (platform, device) => {
    if (platform && platform !== "Unknown") {
      return platform;
    }
    if (device && device !== "Unknown Device") {
      return device;
    }
    return "Unknown Device";
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#d3d1d1]">
      <h2 className="text-xl font-semibold text-white text-center border-b border-white/20 pb-2 mb-6 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] -m-6 px-6 py-4 rounded-t-xl">
        Manage Sessions
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Logout From All Sessions Button */}
          <div className="mb-6">
            <button
              onClick={handleDeleteAllSessions}
              disabled={deleteAllLoading}
              className={`w-full px-4 py-3 bg-gradient-to-l from-[rgba(96,161,249,1)] to-[rgba(17,83,231,1)] text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                deleteAllLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-purple-600"
              }`}
            >
              {deleteAllLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging out...
                </div>
              ) : (
                "Logout From All Sessions"
              )}
            </button>
          </div>

          {/* Sessions List */}
          <div className="space-y-4">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Platform Icon */}
                    <div className="flex-shrink-0">
                      {getPlatformIcon(session.platform, session.device)}
                    </div>

                    {/* Session Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-800">
                          {getPlatformName(session.platform, session.device)}
                        </h3>
                        {session.is_current && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        Browser: {session.browser || "Unknown Browser"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Last Seen: {session.time_text || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-600">
                        IP Address: {session.platform_details || "Unknown IP"}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    disabled={deleteLoading}
                    className="flex-shrink-0 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    title={
                      session.is_current
                        ? "Delete current session (will logout)"
                        : "Delete session"
                    }
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No sessions found</p>
              </div>
            )}
          </div>
        </>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">
            Session deleted successfully!
          </p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Managesession;
