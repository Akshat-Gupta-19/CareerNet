import React, { useContext, useState } from "react";
import logo from "../assets/logo.png";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [searchInput, setSearchInput] = useState("");
  let [searchData, setSearchData] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/search?query=${searchInput}`,
        { withCredentials: true },
      );
      setSearchData(result.data);
      console.log(result.data);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Unable to search users");
    }
  };

  const handleSignout = async () => {
    try {
      let result = axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      toast.success("Logged out successfully!");
      navigate("/login");
      setUserData(null);
    } catch (err) {
      console.log(result);
    }
  };

  useEffect(() => {
    if (searchInput) {
      handleSearch();
    }
  }, [searchInput]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80">
      <div className="max-w-[1280px] mx-auto h-[64px] px-3 sm:px-5 lg:px-7 flex items-center justify-between gap-3">
        {/* ================= LEFT SIDE ================= */}
        <div className="flex items-center gap-3 flex-1 min-w-0 max-w-[560px]">
          {/* Logo */}
          <img
            src={logo}
            alt="CareerNet Logo"
            className="w-[78px] sm:w-[88px] h-auto object-contain cursor-pointer shrink-0"
            onClick={() => {
              navigate("/");
            }}
          />

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <div className="relative">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                onChange={(e) => setSearchInput(e.target.value)}
                value={searchInput}
                type="text"
                placeholder="Search people..."
                className="
                  w-full
                  h-[40px]
                  pl-10
                  pr-4
                  bg-[#f3f7f9]
                  border
                  border-transparent
                  rounded-xl
                  text-sm
                  text-gray-800
                  placeholder:text-gray-400
                  outline-none
                  transition-all
                  duration-200
                  focus:bg-white
                  focus:border-[#0a9ccf]
                  focus:ring-4
                  focus:ring-[#0a9ccf]/10
                "
              />
            </div>

            {/* ================= SEARCH RESULTS ================= */}
            {searchInput && (
              <div
                className="
                  absolute
                  top-[46px]
                  left-0
                  w-[min(380px,calc(100vw-24px))]
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  shadow-[0_15px_45px_rgba(0,0,0,0.12)]
                  overflow-hidden
                  z-[100]
                "
              >
                {searchData.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <div className="w-11 h-11 mx-auto mb-3 rounded-full bg-[#eaf8fc] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#0a9ccf]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      No users found
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Try searching with another name
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[420px] overflow-y-auto">
                    {searchData.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          handleGetProfile(user.username);
                          setSearchInput("");
                          setSearchData([]);
                        }}
                        className="
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          cursor-pointer
                          border-b
                          border-gray-100
                          last:border-b-0
                          hover:bg-[#f4fbfd]
                          transition-colors
                        "
                      >
                        {/* Profile Image */}
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="
                            w-11
                            h-11
                            rounded-full
                            object-cover
                            border
                            border-gray-200
                            shrink-0
                          "
                        />

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </h3>

                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            @{user.username}
                          </p>

                          {user.skills?.length > 0 && (
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {user.skills.slice(0, 3).join(" • ")}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <svg
                          className="w-4 h-4 text-gray-300 shrink-0"
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-1 sm:gap-3 lg:gap-5 text-gray-500">
          {/* Home */}
          <div
            className="
              group
              flex
              flex-col
              items-center
              justify-center
              min-w-[42px]
              sm:min-w-[58px]
              h-[52px]
              rounded-xl
              cursor-pointer
              transition-all
              hover:bg-[#f0fafc]
              hover:text-[#0a9ccf]
            "
            onClick={() => {
              navigate("/");
            }}
          >
            <svg
              className="w-[21px] h-[21px] mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>

            <span className="hidden sm:block text-[11px] font-medium">
              Home
            </span>
          </div>

          {/* My Network */}
          <div
            className="
              group
              flex
              flex-col
              items-center
              justify-center
              min-w-[42px]
              sm:min-w-[72px]
              h-[52px]
              rounded-xl
              cursor-pointer
              transition-all
              hover:bg-[#f0fafc]
              hover:text-[#0a9ccf]
            "
            onClick={() => {
              navigate("/network");
            }}
          >
            <svg
              className="w-[21px] h-[21px] mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>

            <span className="hidden sm:block text-[11px] font-medium">
              Network
            </span>
          </div>

          {/* Notifications */}
          <div
            className="
              group
              flex
              flex-col
              items-center
              justify-center
              min-w-[42px]
              sm:min-w-[72px]
              h-[52px]
              rounded-xl
              cursor-pointer
              transition-all
              hover:bg-[#f0fafc]
              hover:text-[#0a9ccf]
            "
            onClick={() => navigate("/notification")}
          >
            <svg
              className="w-[21px] h-[21px] mb-1"
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

            <span className="hidden sm:block text-[11px] font-medium">
              Alerts
            </span>
          </div>

          {/* ================= PROFILE ================= */}
          <div className="relative border-l border-gray-200 pl-2 sm:pl-4 ml-1">
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="
                flex
                flex-col
                items-center
                justify-center
                min-w-[42px]
                sm:min-w-[55px]
                h-[52px]
                rounded-xl
                cursor-pointer
                select-none
                hover:bg-gray-50
                transition-all
              "
            >
              <img
                src={userData.profileImage}
                alt="Profile"
                className="
                  w-[27px]
                  h-[27px]
                  sm:w-[29px]
                  sm:h-[29px]
                  rounded-full
                  object-cover
                  border-2
                  border-white
                  shadow-sm
                  ring-1
                  ring-gray-200
                "
              />

              <span className="hidden sm:block text-[11px] font-medium text-gray-600 mt-0.5">
                Me
              </span>
            </div>

            {/* ================= PROFILE DROPDOWN ================= */}
            {isOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[58px]
                  w-[250px]
                  sm:w-[270px]
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  shadow-[0_15px_45px_rgba(0,0,0,0.14)]
                  overflow-hidden
                  z-[100]
                "
              >
                {/* Profile Header */}
                <div className="p-5 bg-gradient-to-br from-[#eaf8fc] to-white">
                  <div className="flex flex-col items-center">
                    <img
                      onClick={() => {
                        navigate("/profile");
                      }}
                      src={userData.profileImage}
                      alt="Profile Large"
                      className="
                        w-[72px]
                        h-[72px]
                        rounded-full
                        object-cover
                        border-4
                        border-white
                        shadow-md
                        cursor-pointer
                        hover:scale-105
                        transition-transform
                      "
                    />

                    <h3 className="mt-3 text-sm font-semibold text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[210px]">
                      @{userData.username}
                    </p>
                  </div>
                </div>

                <div className="p-3">
                  {/* View Profile */}
                  <button
                    className="
                      w-full
                      h-[38px]
                      rounded-full
                      border
                      border-[#0a9ccf]
                      text-[#0a9ccf]
                      hover:bg-[#eaf8fc]
                      font-semibold
                      text-xs
                      transition-all
                      mb-3
                    "
                    onClick={() => {
                      handleGetProfile(userData.username);
                    }}
                  >
                    View Profile
                  </button>

                  <div className="h-px bg-gray-100 mb-2" />

                  {/* My Network */}
                  <button
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      text-left
                      py-2.5
                      px-3
                      text-sm
                      text-gray-700
                      hover:bg-gray-50
                      rounded-xl
                      transition
                    "
                    onClick={() => {
                      navigate("/network");
                    }}
                  >
                    <svg
                      className="w-[18px] h-[18px] text-gray-500"
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
                    My Network
                  </button>

                  {/* Sign Out */}
                  <button
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      text-left
                      py-2.5
                      px-3
                      text-sm
                      text-red-600
                      hover:bg-red-50
                      rounded-xl
                      transition
                    "
                    onClick={handleSignout}
                  >
                    <svg
                      className="w-[18px] h-[18px]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
