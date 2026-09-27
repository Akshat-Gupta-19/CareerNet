import { io, userSocketMap } from "../index.js";
import Connection from "../models/connection.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const sendConnection = async (req, res) => {
  try {
    const { id } = req.params;
    const sender = req.userId;

    // Can't send to yourself
    if (sender.toString() === id.toString()) {
      return res.status(400).json({
        message: "You cannot send connection request to yourself",
      });
    }

    // Receiver exists?
    const receiverUser = await User.findById(id);

    if (!receiverUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already connected?
    const senderUser = await User.findById(sender);

    const alreadyConnected = senderUser.connection.some(
      (user) => user.toString() === id.toString(),
    );

    if (alreadyConnected) {
      return res.status(400).json({
        message: "You are already connected",
      });
    }

    // Check pending request in either direction
    const existingRequest = await Connection.findOne({
      $or: [
        {
          sender: sender,
          receiver: id,
          status: "pending",
        },
        {
          sender: id,
          receiver: sender,
          status: "pending",
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Connection request already exists",
      });
    }

    // Create request
    const connection = await Connection.create({
      sender,
      receiver: id,
      status: "pending",
    });

    // =========================
    // SOCKET
    // =========================

    const senderSocketId = userSocketMap.get(sender.toString());

    const receiverSocketId = userSocketMap.get(id.toString());

    // Receiver -> Received
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("connectionUpdate", {
        userId: sender.toString(),
        status: "received",
      });
    }

    // Sender -> Pending
    if (senderSocketId) {
      io.to(senderSocketId).emit("connectionUpdate", {
        userId: id.toString(),
        status: "pending",
      });
    }

    return res.status(201).json({
      message: "Connection request sent",
      connection,
    });
  } catch (err) {
    console.log("sendConnection:", err);

    return res.status(500).json({
      message: "sendConnection error",
      error: err.message,
    });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Request is already processed",
      });
    }

    // Only receiver can accept
    if (connection.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You cannot accept this request",
      });
    }

    // Update connection status
    connection.status = "accepted";
    await connection.save();

    // Add connection to both users
    await User.findByIdAndUpdate(connection.receiver, {
      $addToSet: {
        connection: connection.sender,
      },
    });

    await User.findByIdAndUpdate(connection.sender, {
      $addToSet: {
        connection: connection.receiver,
      },
    });

    // =========================
    // NOTIFICATION
    // =========================

    const notification = await Notification.create({
      receiver: connection.sender,
      type: "connectionAccepted",
      relatedUser: userId,
    });

    await notification.populate(
      "relatedUser",
      "firstName lastName username profileImage"
    );

    // =========================
    // SOCKET
    // =========================

    const receiverSocketId = userSocketMap.get(
      connection.receiver.toString()
    );

    const senderSocketId = userSocketMap.get(
      connection.sender.toString()
    );

    // Receiver
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("connectionUpdate", {
        userId: connection.sender.toString(),
        status: "accepted",
      });
    }

    // Sender
    if (senderSocketId) {
      // Connection status update
      io.to(senderSocketId).emit("connectionUpdate", {
        userId: connection.receiver.toString(),
        status: "accepted",
      });

      // New notification
      io.to(senderSocketId).emit(
        "newNotification",
        notification
      );
    }

    return res.status(200).json({
      message: "Connection accepted",
    });

  } catch (err) {
    console.log("acceptConnection:", err);

    return res.status(500).json({
      message: "acceptConnection error",
      error: err.message,
    });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "Request is already processed",
      });
    }

    // Only receiver can reject
    if (connection.receiver.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You cannot reject this request",
      });
    }

    const senderId = connection.sender.toString();

    const receiverId = connection.receiver.toString();

    await Connection.findByIdAndDelete(connectionId);

    // Notify sender
    const senderSocketId = userSocketMap.get(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("connectionUpdate", {
        userId: receiverId,
        status: "none",
      });
    }

    return res.status(200).json({
      message: "Connection request rejected",
    });
  } catch (err) {
    console.log("rejectConnection:", err);

    return res.status(500).json({
      message: "rejectConnection error",
      error: err.message,
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (userId.toString() === id.toString()) {
      return res.status(400).json({
        message: "You cannot check your own connection status",
      });
    }

    const connection = await Connection.findOne({
      $or: [
        {
          sender: userId,
          receiver: id,
        },
        {
          sender: id,
          receiver: userId,
        },
      ],
    });

    // No connection
    if (!connection) {
      return res.status(200).json({
        status: "none",
      });
    }

    // =========================
    // ACCEPTED
    // =========================

    if (connection.status === "accepted") {
      return res.status(200).json({
        status: "accepted",
        connectionId: connection._id,
      });
    }

    // =========================
    // PENDING
    // =========================

    if (connection.status === "pending") {
      // Current user sent request
      if (connection.sender.toString() === userId.toString()) {
        return res.status(200).json({
          status: "pending",
          connectionId: connection._id,
        });
      }

      // Current user received request
      return res.status(200).json({
        status: "received",
        connectionId: connection._id,
      });
    }

    // Fallback
    return res.status(200).json({
      status: "none",
    });
  } catch (err) {
    console.log("getConnectionStatus:", err);

    return res.status(500).json({
      message: "getConnectionStatus error",
      error: err.message,
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.userId;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({
        message: "Connection does not exist",
      });
    }

    if (connection.status !== "accepted") {
      return res.status(400).json({
        message: "You are not connected with this user",
      });
    }

    // Check user belongs to this connection
    if (
      connection.sender.toString() !== userId.toString() &&
      connection.receiver.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to remove this connection",
      });
    }

    // Find other user
    const otherUser =
      connection.sender.toString() === userId.toString()
        ? connection.receiver
        : connection.sender;

    // Remove connection from current user
    await User.findByIdAndUpdate(userId, {
      $pull: {
        connection: otherUser,
      },
    });

    // Remove connection from other user
    await User.findByIdAndUpdate(otherUser, {
      $pull: {
        connection: userId,
      },
    });

    // Delete connection document
    await Connection.findByIdAndDelete(connectionId);

    // =====================================
    // SOCKET.IO REAL-TIME UPDATE
    // =====================================

    const userSocketId = userSocketMap.get(userId.toString());

    const otherUserSocketId = userSocketMap.get(otherUser.toString());

    // Current user's UI → Connect
    if (userSocketId) {
      io.to(userSocketId).emit("connectionUpdate", {
        userId: otherUser.toString(),
        status: "none",
      });
    }

    // Other user's UI → Connect
    if (otherUserSocketId) {
      io.to(otherUserSocketId).emit("connectionUpdate", {
        userId: userId.toString(),
        status: "none",
      });
    }

    return res.status(200).json({
      message: "Connection removed successfully",
    });
  } catch (err) {
    console.log("removeConnection error:", err);

    return res.status(500).json({
      message: "removeConnection error",
      error: err.message,
    });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Connection.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "firstName lastName username profileImage headline")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests,
    });
  } catch (err) {
    return res.status(500).json({
      message: "getConnectionRequests error",
      error: err.message,
    });
  }
};

export const getUsersConnections = async (req, res) => {
  try {
    const userId = req.userId;

    const connections = await Connection.find({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "firstName lastName username profileImage headline")
      .populate(
        "receiver",
        "firstName lastName username profileImage headline",
      );

    const formattedConnections = connections.map((connection) => {
      const otherUser =
        connection.sender._id.toString() === userId.toString()
          ? connection.receiver
          : connection.sender;

      return {
        connectionId: connection._id,
        user: otherUser,
      };
    });

    return res.status(200).json({
      connections: formattedConnections,
    });
  } catch (err) {
    return res.status(500).json({
      message: "getUsersConnections error",
      error: err.message,
    });
  }
};
