import React, { useContext, useEffect, useState } from "react";

import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";

const socket = io("http://localhost:8000");

function ConnectionButton({ userId }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("none");

  // =========================
  // GET STATUS
  // =========================

  const getStatus = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/connection/status/${userId}`,
        {
          withCredentials: true,
        },
      );

      setStatus(result.data.status);
    } catch (err) {
      console.log("getStatus:", err.response?.data || err);
    }
  };

  // =========================
  // SEND REQUEST
  // =========================

  const handleSendConnection = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/connection/send/${userId}`,
        {},
        {
          withCredentials: true,
        },
      );

      console.log(result.data);

      setStatus("pending");
    } catch (err) {
      console.log("sendConnection:", err.response?.data || err);
    }
  };

  // =========================
  // BUTTON CLICK
  // =========================

  const handleClick = async () => {
    if (status === "none") {
      await handleSendConnection();

      return;
    }

    if (status === "received") {
      navigate("/network");

      return;
    }

    if (status === "accepted") {
      navigate("/network");

      return;
    }
  };

  // =========================
  // INITIAL
  // =========================

  useEffect(() => {
    if (!userData?._id || !userId) {
      return;
    }

    socket.emit("register", userData._id.toString());

    getStatus();

    const handleConnectionUpdate = ({
      userId: updatedUserId,
      status: newStatus,
    }) => {
      if (updatedUserId.toString() === userId.toString()) {
        setStatus(newStatus);
      }
    };

    socket.on("connectionUpdate", handleConnectionUpdate);

    return () => {
      socket.off("connectionUpdate", handleConnectionUpdate);
    };
  }, [userId, userData?._id]);

  // =========================
  // UI
  // =========================

  return (
    <button
      onClick={handleClick}
      disabled={status === "pending"}
      className="px-4 py-1 rounded-full border border-[#0a9ccf] text-[#0788b7] text-sm"
    >
      {status === "none" && "Connect"}

      {status === "pending" && "Pending"}

      {status === "received" && "Received"}

      {status === "accepted" && "Connected"}
    </button>
  );
}

export default ConnectionButton;
