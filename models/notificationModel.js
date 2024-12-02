const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["like", "comment", "message", "follow"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String, // Optional, a link to the post, comment, or user profile
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
notificationSchema.pre(/^find/, function (next) {
  this.populate({ path: "sender", select: "name email" });
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
