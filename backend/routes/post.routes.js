const express = require("express");
const postCtrl = require("../controllers/post.controller");
const authenticateUser = require("../middlewares/authenticateUser");
const validateUserId = require("../middlewares/validateUserId");
const validatePost = require("../middlewares/validatePost");
const router = express.Router();

// create post
router.post(
  "/",
  validatePost,
  //  authenticateUser,
  postCtrl.createPost
);

// get user and friends posts
router.get(
  "/userAndFriendsPosts/:userId",
  // validateUserId,
  //   authenticateUser,
  postCtrl.getUserAndFriendsPosts
);

// get user posts
router.get(
  "/userPosts/:userId",
  // validateUserId,
    // authenticateUser,
  postCtrl.getUserPosts
);

// get post likes
router.get(
  "/:postId/likes",
  validateUserId,
  //   authenticateUser,
  postCtrl.getPostLikes
);

// like a post
router.put(
  "/:postId/like",
  validateUserId,
  //   authenticateUser,
  postCtrl.like
);

// dislike a post: remove userId from likes
router.put(
  "/:postId/dislike",
  validateUserId,
  //   authenticateUser,
  postCtrl.dislike
);

module.exports = router;
