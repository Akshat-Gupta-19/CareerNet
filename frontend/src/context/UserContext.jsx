import React, { createContext, useContext, useEffect, useState } from "react";

import { authDataContext } from "./AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const userDataContext = createContext();

function UserContext({ children }) {
  const navigate = useNavigate();

  let [userData, setUserData] = useState(null);
  let [authLoading, setAuthLoading] = useState(true);
  let { serverUrl } = useContext(authDataContext);

  let [edit, setEdit] = useState(false);
  let [postData, setPostData] = useState([]);
  let [profileData, setProfileData] = useState([]);

  // ==========================================
  // GET PROFILE
  // ==========================================

  const handleGetProfile = async (username) => {
    try {
      let result = await axios.get(
        `${serverUrl}/api/user/profile/${username}`,
        {
          withCredentials: true,
        },
      );

      setProfileData(result.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const getCurrentUser = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/user/currentUser`, {
        withCredentials: true,
      });

      setUserData(result.data);
    } catch (err) {
      console.log("GET CURRENT USER ERROR:", err);

      setUserData(false);
    } finally {
      setAuthLoading(false);
    }
  };

  // ==========================================
  // GET POSTS
  // ==========================================

  const getPost = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/post/getPost`, {
        withCredentials: true,
      });

      setPostData(result.data);

      console.log(result.data);
    } catch (err) {
      console.log("GET POST ERROR:", err);
    }
  };

  // ==========================================
  // AUTH INITIALIZATION
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("✅ AUTH TOKEN LOADED FROM LOCAL STORAGE");
    } else {
      console.log("❌ NO AUTH TOKEN FOUND");
    }

    getCurrentUser();
  }, []);

  // ==========================================
  // GET POSTS AFTER USER LOGIN
  // ==========================================

  useEffect(() => {
    if (userData) {
      getPost();
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    authLoading,

    edit,
    setEdit,

    postData,
    setPostData,

    getPost,

    profileData,
    setProfileData,

    handleGetProfile,
  };

  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
