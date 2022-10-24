const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

module.exports = {
  createComment: async function (req, res, next) {
    try {
      const { postId, comment, userId } = req.body;
      let post = await Post.findById(postId);

      if (!post) {
        const err = new Error(`post is not found for this postId: ${postId}`);
        err.statusCode = 404;
        return next(err);
      }

      let newComment = new Comment({
        postId,
        comment,
        userId,
      });

      newComment = await newComment.save();
      newComment = await Comment.findById(newComment._id).populate(
        "userId",
        "name"
      );
      res.status(200).json(newComment);
    } catch (error) {
      next(error);
    }
  },
};
