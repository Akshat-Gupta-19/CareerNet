import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import toast from "react-hot-toast";

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
      toast.success("Connection request sent!");
    } catch (err) {
      console.log("sendConnection:", err.response?.data || err);
      toast.error(
        err.response?.data?.message || "Failed to send connection request",
      );
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
      className={`
        h-[40px]
        min-w-[105px]
        px-5
        rounded-full
        text-sm
        font-semibold
        transition-all
        duration-200
        active:scale-[0.97]

        ${
          status === "none"
            ? "bg-[#0a9ccf] text-white border border-[#0a9ccf] hover:bg-[#0788b7] hover:border-[#0788b7] shadow-[0_4px_12px_rgba(10,156,207,0.20)]"
            : ""
        }

        ${
          status === "pending"
            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
            : ""
        }

        ${
          status === "received"
            ? "bg-[#eaf8fc] text-[#0788b7] border border-[#a9deeb] hover:bg-[#dff4f9]"
            : ""
        }

        ${
          status === "accepted"
            ? "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100"
            : ""
        }
      `}
    >
      {status === "none" && (
        <span className="flex items-center justify-center gap-1.5">
          <span className="text-base leading-none">+</span>
          Connect
        </span>
      )}

      {status === "pending" && (
        <span className="flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          Pending
        </span>
      )}

      {status === "received" && (
        <span className="flex items-center justify-center gap-1.5">
          <span>View Request</span>
          <span className="text-xs">→</span>
        </span>
      )}

      {status === "accepted" && (
        <span className="flex items-center justify-center gap-1.5">
          <span>✓</span>
          Connected
        </span>
      )}
    </button>
  );
}

export default ConnectionButton;
