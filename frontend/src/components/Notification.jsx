import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import Nav from "./Nav";
import toast from "react-hot-toast";

function Notification() {
  const { serverUrl } = useContext(authDataContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET NOTIFICATIONS
  // =========================

  const getNotifications = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/notification/get`, {
        withCredentials: true,
      });

      setNotifications(result.data);
    } catch (err) {
      console.log("Get notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE NOTIFICATION
  // =========================

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/notification/delete/${id}`, {
        withCredentials: true,
      });

      toast.success("Notification deleted");

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id),
      );
    } catch (err) {
      console.log("Delete notification:", err);
      toast.success("All notifications cleared!");
    }
  };

  // =========================
  // CLEAR ALL
  // =========================

  const clearAllNotifications = async () => {
    try {
      await axios.delete(`${serverUrl}/api/notification/clearAll`, {
        withCredentials: true,
      });

      setNotifications([]);
    } catch (err) {
      console.log("Clear notifications:", err);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  // =========================
  // NOTIFICATION MESSAGE
  // =========================

  const getMessage = (notification) => {
    const user = notification.relatedUser;
    const name = user ? `${user.firstName} ${user.lastName}` : "Someone";
    if (notification.type === "like") {
      return (
        <>
          <span className="font-semibold">{name}</span> liked your post.
        </>
      );
    }
    if (notification.type === "comment") {
      return (
        <>
          <span className="font-semibold">{name}</span> commented on your post.
        </>
      );
    }
    if (notification.type === "connectionAccepted") {
      return (
        <>
          <span className="font-semibold">{name}</span> accepted your connection
          request.
        </>
      );
    }
    return "You have a new notification.";
  };

  // =========================
  // ICON
  // =========================

  const getIcon = (type) => {
    if (type === "like") {
      return (
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-500">
          ❤️
        </div>
      );
    }

    if (type === "comment") {
      return (
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
          💬
        </div>
      );
    }

    if (type === "connectionAccepted") {
      return (
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
          🤝
        </div>
      );
    }

    return (
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
        🔔
      </div>
    );
  };

  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Notifications
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Stay updated with your network
              </p>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-12 text-center text-gray-500">
              Loading notifications...
            </div>
          )}

          {/* Empty */}
          {!loading && notifications.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-5xl mb-4">🔔</div>

              <h2 className="text-lg font-semibold text-gray-700">
                No notifications
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                You're all caught up!
              </p>
            </div>
          )}

          {/* Notifications */}
          {!loading && notifications.length > 0 && (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  {/* Profile Image */}
                  <img
                    src={
                      notification.relatedUser?.profileImage ||
                      "https://i.pravatar.cc/100"
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />

                  {/* Icon */}
                  {getIcon(notification.type)}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      {getMessage(notification)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="text-gray-400 hover:text-red-500 transition text-lg"
                    title="Delete notification"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Notification;