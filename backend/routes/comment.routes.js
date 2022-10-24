const express = require("express");
const validateComment = require("../middlewares/validateComment");
const router = express.Router();
const commentCtrl = require("../controllers/comment.controller");
const authenticateUser = require("../middlewares/authenticateUser");

// get and post a comment
router
  .route("/")
  .post(validateComment, authenticateUser, commentCtrl.createComment);

// get post comments

module.exports = router;
