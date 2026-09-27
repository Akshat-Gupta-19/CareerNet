import Notification from "../models/notification.model.js"

export const getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({
      receiver: req.userId,
    })
      .populate("relatedUser", "firstName lastName profileImage username")
      .populate("relatedPost", "image description")
      .sort({ createdAt: -1 });

    return res.status(200).json(notifications);
  } catch (err) {
    console.log("Get notification error:", err);
    return res.status(500).json({
      message: "Failed to get notifications",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndDelete({
      _id: id,
      receiver: req.userId,
    });
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
    return res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (err) {
    console.log("Delete notification error:", err);
    return res.status(500).json({
      message: "Failed to delete notification",
    });
  }
};

export const clearAllNotification = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      receiver: req.userId,
    });
    return res.status(200).json({
      message: "All notifications cleared successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.log("Clear all notifications error:", err);
    return res.status(500).json({
      message: "Failed to clear notifications",
    });
  }
};