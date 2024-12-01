const express = require("express");
const postController = require("../controllers/postController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, postController.createPost)
  .get(postController.getAllPosts);

router
  .route("/:id")
  .get(postController.getPost)
  .patch(postController.updatePost)
  .delete(postController.deletePost);

module.exports = router;
