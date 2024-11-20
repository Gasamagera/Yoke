const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },

  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false, // Exclude password from query results
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [250, "Bio must be less than or equal to 250 characters"],
  },
  profilePicture: {
    type: String,
    default: "default.jpg", // Placeholder for user profile picture
  },
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
