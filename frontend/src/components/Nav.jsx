import React, { useContext, useState } from "react";
import logo from "../assets/logo.png";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
    }
  };

  const handleSignout = async () => {
    try {
      let result = axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
        {/* Left Side: Logo & Search Box */}
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          {/* Logo */}
          <img
            src={logo}
            alt="CarrrerNet Logo"
            className="w-[65px]"
            onClick={() => {
              navigate("/");
            }}
          />

          {/* Search Box */}
          <div className="relative w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10"
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
              placeholder="Search"
              className="w-full pl-9 pr-4 py-1.5 bg-gray-100 rounded-md text-sm border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none"
            />

            {/* Search Results */}
            {searchInput && (
              <div className="absolute top-full left-0 mt-2 w-[350px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[100]">
                {/* Loading / No Results */}
                {searchData.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500">No users found</p>
                  </div>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto">
                    {searchData.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => {
                          handleGetProfile(user.username);
                          setSearchInput("");
                          setSearchData([]);
                        }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                      >
                        {/* Profile Image */}
                        <img
                          src={user.profileImage}
                          alt={user.username}
                          className="w-11 h-11 rounded-full object-cover border border-gray-200"
                        />

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {user.firstName} {user.lastName}
                          </h3>

                          <p className="text-xs text-gray-500 truncate">
                            @{user.username}
                          </p>

                          {/* Skills */}
                          {user.skills?.length > 0 && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {user.skills.slice(0, 3).join(" • ")}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Navigation Items */}
        <div className="flex items-center gap-4 sm:gap-7 text-gray-600">
          {/* Home */}
          <div
            className="flex flex-col items-center cursor-pointer hover:text-black text-xs"
            onClick={() => {
              navigate("/");
            }}
          >
            <svg
              className="w-5 h-5 mb-0.5"
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
            <span className="hidden sm:inline">Home</span>
          </div>

          {/* My Network */}
          <div
            className="flex flex-col items-center cursor-pointer hover:text-black text-xs"
            onClick={() => {
              navigate("/network");
            }}
          >
            <svg
              className="w-5 h-5 mb-0.5"
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
            <span className="hidden sm:inline">My Network</span>
          </div>

          {/* Notifications */}
          <div className="flex flex-col items-center cursor-pointer hover:text-black text-xs">
            <svg
              className="w-5 h-5 mb-0.5"
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
            <span className="hidden sm:inline">Notifications</span>
          </div>

          {/* Profile Section With Popup */}
          <div className="relative border-l pl-4 border-gray-200">
            {/* Clickable Profile Trigger */}
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex flex-col items-center cursor-pointer hover:text-black text-xs select-none"
            >
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="hidden sm:inline mt-0.5">Me</span>
            </div>

            {/* Dropdown Popup */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 flex flex-col items-center">
                {/* 1. Large Round Profile Image */}
                <img
                  onClick={() => {
                    navigate("/profile");
                  }}
                  src={userData.profileImage}
                  alt="Profile Large"
                  className="w-16 h-16 rounded-full object-cover border border-gray-300 mb-3"
                />

                {/* 2. View Profile Button */}
                <button
                  className="w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-1 rounded-full text-xs transition mb-3"
                  onClick={() => {
                    handleGetProfile(userData.username);
                  }}
                >
                  View Profile
                </button>

                <hr className="w-full border-gray-200 mb-2" />

                {/* 3. My Network Button */}
                <button
                  className="w-full text-left py-1.5 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => {
                    navigate("/network");
                  }}
                >
                  My Network
                </button>

                {/* 4. Sign Out Button */}
                <button
                  className="w-full text-left py-1.5 px-2 text-sm text-red-600 hover:bg-red-50 rounded"
                  onClick={handleSignout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;