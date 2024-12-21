const express = require("express");
const notificationController = require("../controllers/notificationController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

// Create Notification
router.post("/create", notificationController.createNotification);
router.post("/send-notification", notificationController.sendNotification);
// Get All Notifications for User
router.get("/", notificationController.getNotifications);

// Mark Notification as Read
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;
