const Notification = require("./../models/notificationModel");
const mongoose = require("mongoose");
const { getIO } = require("./../sockets/socket");

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
    const notifications = await Notification.find();

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

exports.sendNotification = async (req, res) => {
  try {
    const io = getIO();
    const notification = { message: "New notification!" };

    // Emit to a specific user
    io.to(req.user.id).emit("notification", notification);

    res.status(200).json({
      status: "success",
      message: "Notification sent.",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};
