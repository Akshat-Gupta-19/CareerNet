import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { authDataContext } from "../context/AuthContext";
import ConnectionButton from "./ConnectionButton";
import { userDataContext } from "../context/UserContext";

function RightSidebar() {
  let { handleGetProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);

  let [suggestedUsers, setSuggestedUsers] = useState([]);

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/suggestedUsers`, {
        withCredentials: true,
      });

      setSuggestedUsers(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleSuggestedUsers();
  }, []);

  return (
    <div className="w-full h-full">
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200/80
          shadow-[0_2px_12px_rgba(0,0,0,0.04)]
          overflow-hidden
          h-full
          flex
          flex-col
        "
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="px-4 sm:px-5 pt-5 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="
                w-9
                h-9
                rounded-xl
                bg-[#eaf8fc]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <svg
                className="w-[18px] h-[18px] text-[#0a9ccf]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                />
              </svg>
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-[15px]">
                People you may know
              </h3>

              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                Grow your professional network
              </p>
            </div>
          </div>
        </div>

        {/* ================================= */}
        {/* SCROLLABLE USERS */}
        {/* ================================= */}

        <div
          className="
            flex-1
            min-h-0
            overflow-y-auto
            px-3
            sm:px-4
            pb-2
            scrollbar-thin
            scrollbar-thumb-gray-300
            scrollbar-track-transparent
          "
        >
          {suggestedUsers.length === 0 ? (
            <div className="py-7 text-center">
              <div
                className="
                  w-10
                  h-10
                  mx-auto
                  rounded-xl
                  bg-gray-50
                  flex
                  items-center
                  justify-center
                  mb-2
                "
              >
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z"
                  />
                </svg>
              </div>

              <p className="text-xs text-gray-400">No suggestions available</p>
            </div>
          ) : (
            suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="
                  flex
                  items-center
                  gap-2.5
                  py-3
                  px-1
                  border-b
                  border-gray-100
                  last:border-none
                  rounded-xl
                  hover:bg-[#fbfeff]
                  transition-colors
                "
              >
                {/* Profile Image */}
                <img
                  onClick={() => handleGetProfile(user.username)}
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="
                    w-10
                    h-10
                    sm:w-11
                    sm:h-11
                    rounded-full
                    object-cover
                    border
                    border-gray-200
                    cursor-pointer
                    shrink-0
                    hover:opacity-90
                    transition
                  "
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => handleGetProfile(user.username)}
                    className="
                      text-xs
                      sm:text-[13px]
                      font-semibold
                      text-gray-900
                      truncate
                      cursor-pointer
                      hover:text-[#0a9ccf]
                      transition-colors
                    "
                  >
                    {user.firstName} {user.lastName}
                  </h4>

                  <p className="text-[10px] sm:text-[11px] text-gray-500 truncate mt-0.5">
                    @{user.username}
                  </p>

                  <p className="text-[9px] sm:text-[10px] text-gray-400 truncate mt-1">
                    {user.skills?.join(" • ")}
                  </p>
                </div>

                {/* Connect Button */}
                <div className="shrink-0">
                  <ConnectionButton userId={user._id} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================================= */}
        {/* SHOW MORE */}
        {/* ================================= */}

        <div className="border-t border-gray-100 px-4 py-3 shrink-0">
          <button
            className="
              w-full
              flex
              items-center
              justify-center
              gap-1
              text-xs
              sm:text-sm
              font-semibold
              text-[#0a9ccf]
              py-2
              rounded-lg
              hover:bg-[#eaf8fc]
              transition-all
            "
          >
            Show more
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
