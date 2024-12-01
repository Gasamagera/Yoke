const mongoose = require("mongoose");
//const User = require("./../models/userModel");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "A post must have content"],
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A post must have an author"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: "author",
    select: "-createdAt -updatedAt -__v -role -email",
  }).populate({
    path: "likes",
    select: "-__v ",
  });
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
