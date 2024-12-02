const Notification = require("./../models/notificationModel");

// Create Notification
exports.createNotification = async (req, res) => {
  const { recipient, type, message, link } = req.body;

  try {
    const notification = await Notification.create({
      sender: req.user._id,
      recipient,
      type,
      message,
      link,
    });

    res.status(201).json({
      status: "success",
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for user:", req.user._id);
    const notifications = await Notification.find({
      recipient: req.user._id,
    }).sort("-createdAt");
    console.log("Fetched Notifications:", notifications);
    res.status(200).json({
      status: "success",
      results: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

// Mark Notification as Read
exports.markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
