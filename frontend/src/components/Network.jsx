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

      // Remove accepted request
      setRequests((prev) =>
        prev.filter((request) => request._id !== connectionId),
      );

      // Refresh connections
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
      // Remove request from UI
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

      // Remove from UI immediately
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
      <div className="min-h-screen bg-[#f3f6f8]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* ================================= */}
          {/* CONNECTION REQUESTS */}
          {/* ================================= */}

          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              Connection Requests
            </h2>

            {loadingRequests ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-500">Loading requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No connection requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const sender = request.sender;

                  return (
                    <div
                      key={request._id}
                      className="flex items-center justify-between border border-gray-200 rounded-xl p-4"
                    >
                      {/* USER INFO */}

                      <div className="flex items-center gap-4">
                        <img
                          src={
                            sender?.profileImage || "https://i.pravatar.cc/150"
                          }
                          alt="profile"
                          className="w-14 h-14 rounded-full object-cover"
                        />

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {sender?.firstName} {sender?.lastName}
                          </h3>

                          <p className="text-sm text-gray-500">
                            @{sender?.username}
                          </p>

                          {sender?.headline && (
                            <p className="text-sm text-gray-500 mt-1">
                              {sender.headline}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAccept(request._id)}
                          className="px-5 py-2 rounded-full bg-[#0a9ccf] text-white text-sm font-medium hover:bg-[#087fa9] transition"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => handleReject(request._id)}
                          className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition"
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

          {/* ================================= */}
          {/* MY CONNECTIONS */}
          {/* ================================= */}

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-gray-800">
                My Connections
              </h2>

              <span className="text-sm text-gray-500">
                {connections.length}{" "}
                {connections.length === 1 ? "Connection" : "Connections"}
              </span>
            </div>

            {loadingConnections ? (
              <div className="flex justify-center py-8">
                <p className="text-gray-500">Loading connections...</p>
              </div>
            ) : connections.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">
                  You don't have any connections yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((connection) => {
                  const user = connection.user;

                  return (
                    <div
                      key={connection.connectionId}
                      className="flex items-center justify-between border border-gray-200 rounded-xl p-4"
                    >
                      {/* USER INFO */}

                      <div className="flex items-center gap-4">
                        <img
                          src={
                            user?.profileImage || "https://i.pravatar.cc/150"
                          }
                          alt="profile"
                          className="w-14 h-14 rounded-full object-cover"
                        />

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {user?.firstName} {user?.lastName}
                          </h3>

                          <p className="text-sm text-gray-500">
                            @{user?.username}
                          </p>

                          {user?.headline && (
                            <p className="text-sm text-gray-500 mt-1">
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
                        className="px-5 py-2 rounded-full border border-red-400 text-red-500 text-sm font-medium hover:bg-red-50 transition"
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
    </>
  );
}

export default Network;
