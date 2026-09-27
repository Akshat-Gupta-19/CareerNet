import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import Nav from "./Nav";
import toast from "react-hot-toast";

function Network() {
  const { serverUrl } = useContext(authDataContext);

  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(true);

  // =========================================
  // GET CONNECTION REQUESTS
  // =========================================

  const getRequests = async () => {
    try {
      setLoadingRequests(true);

      const result = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true,
      });

      setRequests(result.data.requests || []);
    } catch (err) {
      console.log("getRequests:", err.response?.data || err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // =========================================
  // GET MY CONNECTIONS
  // =========================================

  const getConnections = async () => {
    try {
      setLoadingConnections(true);

      const result = await axios.get(`${serverUrl}/api/connection`, {
        withCredentials: true,
      });

      setConnections(result.data.connections || []);
    } catch (err) {
      console.log("getConnections:", err.response?.data || err);
    } finally {
      setLoadingConnections(false);
    }
  };

  // =========================================
  // ACCEPT REQUEST
  // =========================================

  const handleAccept = async (connectionId) => {
    try {
      await axios.put(
        `${serverUrl}/api/connection/accept/${connectionId}`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success("Connection request accepted!");

      setRequests((prev) =>
        prev.filter((request) => request._id !== connectionId),
      );

      getConnections();
    } catch (err) {
      console.log("handleAccept:", err.response?.data || err);
      toast.error(
        err.response?.data?.message || "Failed to accept connection request",
      );
    }
  };

  // =========================================
  // REJECT REQUEST
  // =========================================

  const handleReject = async (connectionId) => {
    try {
      await axios.delete(`${serverUrl}/api/connection/reject/${connectionId}`, {
        withCredentials: true,
      });

      toast.success("Connection request rejected!");

      setRequests((prev) =>
        prev.filter((request) => request._id !== connectionId),
      );
    } catch (err) {
      console.log("handleReject:", err.response?.data || err);
      toast.error(
        err.response?.data?.message || "Failed to reject connection request",
      );
    }
  };

  // =========================================
  // REMOVE CONNECTION
  // =========================================

  const handleRemoveConnection = async (connectionId) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this connection?",
    );

    if (!confirmRemove) {
      return;
    }

    try {
      await axios.delete(`${serverUrl}/api/connection/remove/${connectionId}`, {
        withCredentials: true,
      });

      toast.success("Connection removed successfully!");

      setConnections((prev) =>
        prev.filter((connection) => connection.connectionId !== connectionId),
      );
    } catch (err) {
      console.log("handleRemoveConnection:", err.response?.data || err);

      toast.error(err.response?.data?.message || "Failed to remove connection");
    }
  };

  // =========================================
  // INITIAL DATA
  // =========================================

  useEffect(() => {
    getRequests();
    getConnections();
  }, []);

  // =========================================
  // UI
  // =========================================

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-[#f4f7f9]">
        <div className="max-w-[1050px] mx-auto px-3 sm:px-5 lg:px-6 py-5 sm:py-7 lg:py-9">
          {/* ================================= */}
          {/* PAGE HEADER */}
          {/* ================================= */}

          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              My Network
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your connection requests and professional network.
            </p>
          </div>

          {/* ================================= */}
          {/* CONNECTION REQUESTS */}
          {/* ================================= */}

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden mb-5 sm:mb-7">
            {/* Section Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eaf8fc] flex items-center justify-center shrink-0">
                    <svg
                      className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#0a9ccf]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3M15 21H6a3 3 0 01-3-3v-1a6 6 0 016-6h3a6 6 0 016 6v1a3 3 0 01-3 3zM12 7a4 4 0 100-8 4 4 0 000 8z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      Connection Requests
                    </h2>

                    <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
                      People who want to connect with you
                    </p>
                  </div>
                </div>

                {requests.length > 0 && (
                  <span className="min-w-[28px] h-7 px-2 rounded-full bg-[#eaf8fc] text-[#0788b7] text-xs font-bold flex items-center justify-center">
                    {requests.length}
                  </span>
                )}
              </div>
            </div>

            {/* Section Content */}
            <div className="p-3 sm:p-5">
              {loadingRequests ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-8 h-8 border-2 border-[#0a9ccf]/20 border-t-[#0a9ccf] rounded-full animate-spin mb-3" />

                  <p className="text-sm text-gray-500">Loading requests...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="py-10 sm:py-12 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-medium text-gray-600">
                    No connection requests
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    New connection requests will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {requests.map((request) => {
                    const sender = request.sender;

                    return (
                      <div
                        key={request._id}
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                          gap-4
                          p-4
                          sm:p-4
                          rounded-2xl
                          border
                          border-gray-200
                          hover:border-[#b8e6f3]
                          hover:bg-[#fbfeff]
                          transition-all
                        "
                      >
                        {/* USER INFO */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <img
                            src={
                              sender?.profileImage ||
                              "https://i.pravatar.cc/150"
                            }
                            alt="profile"
                            className="
                              w-12
                              h-12
                              sm:w-14
                              sm:h-14
                              rounded-full
                              object-cover
                              border
                              border-gray-200
                              shrink-0
                            "
                          />

                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                              {sender?.firstName} {sender?.lastName}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                              @{sender?.username}
                            </p>

                            {sender?.headline && (
                              <p className="text-xs sm:text-sm text-gray-400 truncate mt-1 max-w-[500px]">
                                {sender.headline}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                          <button
                            onClick={() => handleAccept(request._id)}
                            className="
                              flex-1
                              sm:flex-none
                              min-w-[100px]
                              px-4
                              sm:px-5
                              py-2.5
                              rounded-full
                              bg-[#0a9ccf]
                              text-white
                              text-xs
                              sm:text-sm
                              font-semibold
                              hover:bg-[#0788b7]
                              active:scale-[0.98]
                              transition-all
                              shadow-sm
                            "
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => handleReject(request._id)}
                            className="
                              flex-1
                              sm:flex-none
                              min-w-[100px]
                              px-4
                              sm:px-5
                              py-2.5
                              rounded-full
                              border
                              border-gray-300
                              bg-white
                              text-gray-600
                              text-xs
                              sm:text-sm
                              font-semibold
                              hover:bg-gray-50
                              hover:border-gray-400
                              active:scale-[0.98]
                              transition-all
                            "
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ================================= */}
          {/* MY CONNECTIONS */}
          {/* ================================= */}

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Section Header */}
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#eaf8fc] flex items-center justify-center shrink-0">
                    <svg
                      className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#0a9ccf]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      My Connections
                    </h2>

                    <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
                      People you're connected with
                    </p>
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
                  {connections.length}{" "}
                  {connections.length === 1 ? "Connection" : "Connections"}
                </span>
              </div>
            </div>

            {/* Section Content */}
            <div className="p-3 sm:p-5">
              {loadingConnections ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-8 h-8 border-2 border-[#0a9ccf]/20 border-t-[#0a9ccf] rounded-full animate-spin mb-3" />

                  <p className="text-sm text-gray-500">
                    Loading connections...
                  </p>
                </div>
              ) : connections.length === 0 ? (
                <div className="py-10 sm:py-12 text-center">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                    <svg
                      className="w-6 h-6 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                      />
                    </svg>
                  </div>

                  <p className="text-sm font-medium text-gray-600">
                    You don't have any connections yet.
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Start connecting with people to grow your network.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {connections.map((connection) => {
                    const user = connection.user;

                    return (
                      <div
                        key={connection.connectionId}
                        className="
                          flex
                          flex-col
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                          gap-4
                          p-4
                          rounded-2xl
                          border
                          border-gray-200
                          hover:border-[#b8e6f3]
                          hover:bg-[#fbfeff]
                          transition-all
                        "
                      >
                        {/* USER INFO */}
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                          <img
                            src={
                              user?.profileImage || "https://i.pravatar.cc/150"
                            }
                            alt="profile"
                            className="
                              w-12
                              h-12
                              sm:w-14
                              sm:h-14
                              rounded-full
                              object-cover
                              border
                              border-gray-200
                              shrink-0
                            "
                          />

                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                              {user?.firstName} {user?.lastName}
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">
                              @{user?.username}
                            </p>

                            {user?.headline && (
                              <p className="text-xs sm:text-sm text-gray-400 truncate mt-1 max-w-[500px]">
                                {user.headline}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* DISCONNECT */}
                        <button
                          onClick={() =>
                            handleRemoveConnection(connection.connectionId)
                          }
                          className="
                            w-full
                            sm:w-auto
                            px-5
                            py-2.5
                            rounded-full
                            border
                            border-red-200
                            bg-white
                            text-red-500
                            text-xs
                            sm:text-sm
                            font-semibold
                            hover:bg-red-50
                            hover:border-red-300
                            active:scale-[0.98]
                            transition-all
                          "
                        >
                          Disconnect
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Network;
