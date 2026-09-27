
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
          <span className="font-semibold text-gray-900">{name}</span>{" "}
          liked your post.
        </>
      );
    }

    if (notification.type === "comment") {
      return (
        <>
          <span className="font-semibold text-gray-900">{name}</span>{" "}
          commented on your post.
        </>
      );
    }

    if (notification.type === "connectionAccepted") {
      return (
        <>
          <span className="font-semibold text-gray-900">{name}</span>{" "}
          accepted your connection request.
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
        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-red-50 flex items-center justify-center text-base sm:text-lg">
          ❤️
        </div>
      );
    }

    if (type === "comment") {
      return (
        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-base sm:text-lg">
          💬
        </div>
      );
    }

    if (type === "connectionAccepted") {
      return (
        <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-green-50 flex items-center justify-center text-base sm:text-lg">
          🤝
        </div>
      );
    }

    return (
      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-base sm:text-lg">
        🔔
      </div>
    );
  };

  return (
    <>
      <Nav />

      <div className="min-h-screen bg-[#f4f7f9]">
        <div className="max-w-[850px] mx-auto px-3 sm:px-5 lg:px-6 py-5 sm:py-7 lg:py-9">

          {/* ========================= */}
          {/* PAGE HEADER */}
          {/* ========================= */}

          <div className="mb-5 sm:mb-7">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Notifications
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Stay updated with your network activity.
            </p>
          </div>

          {/* ========================= */}
          {/* NOTIFICATION CARD */}
          {/* ========================= */}

          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">

            {/* ========================= */}
            {/* HEADER */}
            {/* ========================= */}

            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-3 min-w-0">
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      Notifications
                    </h2>

                    <p className="hidden sm:block text-xs text-gray-400 mt-0.5">
                      Stay updated with your network
                    </p>
                  </div>
                </div>

                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="
                      shrink-0
                      px-3
                      sm:px-4
                      py-2
                      rounded-full
                      text-xs
                      sm:text-sm
                      font-semibold
                      text-red-500
                      border
                      border-red-100
                      hover:bg-red-50
                      hover:border-red-200
                      transition-all
                    "
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* ========================= */}
            {/* LOADING */}
            {/* ========================= */}

            {loading && (
              <div className="py-14 sm:py-16 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#0a9ccf]/20 border-t-[#0a9ccf] rounded-full animate-spin mb-4" />

                <p className="text-sm text-gray-500">
                  Loading notifications...
                </p>
              </div>
            )}

            {/* ========================= */}
            {/* EMPTY */}
            {/* ========================= */}

            {!loading && notifications.length === 0 && (
              <div className="py-14 sm:py-20 px-5 text-center">

                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] mx-auto rounded-2xl bg-[#eaf8fc] flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 text-[#0a9ccf]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>

                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  No notifications
                </h2>

                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            )}

            {/* ========================= */}
            {/* NOTIFICATIONS */}
            {/* ========================= */}

            {!loading && notifications.length > 0 && (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="
                      group
                      flex
                      items-start
                      gap-3
                      sm:gap-4
                      px-4
                      sm:px-6
                      py-4
                      sm:py-5
                      border-b
                      border-gray-100
                      last:border-b-0
                      hover:bg-[#fbfdfe]
                      transition-colors
                    "
                  >
                    {/* PROFILE IMAGE */}
                    <img
                      src={
                        notification.relatedUser?.profileImage ||
                        "https://i.pravatar.cc/100"
                      }
                      alt="Profile"
                      className="
                        w-11
                        h-11
                        sm:w-12
                        sm:h-12
                        rounded-full
                        object-cover
                        border
                        border-gray-200
                        shrink-0
                      "
                    />

                    {/* TYPE ICON */}
                    {getIcon(notification.type)}

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0 pt-0.5">

                      <p className="text-xs sm:text-sm text-gray-600 leading-5 sm:leading-6">
                        {getMessage(notification)}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        <svg
                          className="w-3 h-3 text-gray-300 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 2"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            strokeWidth="2"
                          />
                        </svg>

                        <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                          {new Date(
                            notification.createdAt,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        deleteNotification(notification._id)
                      }
                      className="
                        w-8
                        h-8
                        shrink-0
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-gray-300
                        hover:text-red-500
                        hover:bg-red-50
                        transition-all
                        text-xl
                        sm:opacity-0
                        sm:group-hover:opacity-100
                      "
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