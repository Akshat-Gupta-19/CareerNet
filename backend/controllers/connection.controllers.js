import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";

export const sendConnection = async (req, res) => {
  try {
    let { id } = req.params; //receiver
    let sender = req.userId; // sender
    let user = await User.findById(sender);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (sender.toString() === id.toString()) {
      return res.status(400).json({
        message: "You cannot send request to yourself",
      });
    }
    if (user.connection.some((item) => item.toString() === id.toString())) {
      return res.status(400).json({
        message: "You are already connected",
      });
    }
    let existingConnection = await Connection.findOne({
      $or: [
        { sender, receiver: id, status: "pending" },
        { sender: id, receiver: sender, status: "pending" },
      ],
    });
    if (existingConnection) {
      return res.status(400).json({
        message: "Connection request already exists",
      });
    }
    let newRequest = await Connection.create({
      sender,
      receiver: id,
    });
    return res.status(200).json(newRequest);
  } catch (err) {
    return res.status(500).json({
      message: "sendConnection error",
      error: err.message,
    });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({
        message: "connection does not exist",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "request is already processed",
      });
    }

    connection.status = "accepted";
    await connection.save();
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: {
        connection: connection.sender,
      },
    });
    await User.findByIdAndUpdate(connection.sender, {
      $addToSet: {
        connection: req.userId,
      },
    });
    return res.status(200).json({
      message: "connection accepted",
    });
  } catch (err) {
    return res.status(500).json({
      message: "acceptConnection error",
      error: err.message,
    });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({
        message: "connection does not exist",
      });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({
        message: "request is already processed",
      });
    }

    connection.status = "rejected";
    await connection.save();
    return res.status(200).json({
      message: "connection rejected",
    });
  } catch (err) {
    return res.status(500).json({
      message: "rejectConnection error",
      error: err.message,
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    let { id } = req.params; //receiver
    let userId = req.userId; // sender

    if (userId.toString() === id.toString()) {
      return res.status(400).json({
        message: "You cannot check connection status with yourself",
      });
    }

    let connection = await Connection.findOne({
      $or: [
        { sender: userId, receiver: id },
        { sender: id, receiver: userId },
      ],
    });

    if (!connection) {
      return res.status(200).json({
        status: "none",
      });
    }

    return res.status(200).json({
      status: connection.status,
      connectionId: connection._id,
      sender: connection.sender,
      receiver: connection.receiver,
    });

  } catch (err) {
    return res.status(500).json({
      message: "getConnectionStatus error",
      error: err.message,
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    let { connectionId } = req.params;
    let userId = req.userId; //its we 

    let connection = await Connection.findById(connectionId);

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

    // Check user is actually part of this connection
    if (
      connection.sender.toString() !== userId.toString() &&
      connection.receiver.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to remove this connection",
      });
    }

    let otherUser =
      connection.sender.toString() === userId.toString()
        ? connection.receiver
        : connection.sender;

    // Remove connection from both users
    await User.findByIdAndUpdate(userId, {
      $pull: {
        connection: otherUser,
      },
    });

    await User.findByIdAndUpdate(otherUser, {
      $pull: {
        connection: userId,
      },
    });

    // Delete connection record
    await Connection.findByIdAndDelete(connectionId);

    return res.status(200).json({
      message: "Connection removed successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: "removeConnection error",
      error: err.message,
    });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    let userId = req.userId;

    let requests = await Connection.find({
      receiver: userId,
      status: "pending",
    }).populate(
      "sender",
      "firstName lastName email username profileImage headline"
    );

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
    let userId = req.userId;

    let user = await User.findById(userId).populate(
      "connection",
      "firstName lastName username profileImage headline connection"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      connections: user.connection,
    });

  } catch (err) {
    return res.status(500).json({
      message: "getUsersConnections error",
      error: err.message,
    });
  }
};