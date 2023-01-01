const Post = require("../models/post.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");

module.exports = {
  createPost: async function (req, res, next) {
    try {
      let newPost = new Post(req.body);
      await newPost.save();
      newPost = await Post.findOne({ userId: req.body.userId })
        .populate("user", "name")
        .exec();
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  },
  getUserAndFriendsPosts: async function (req, res, next) {
    try {
      const userAndFriendsPosts = await User.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.params.userId) },
        },
        {
          $addFields: {
            users: {
              $concatArrays: [
                "$friends",
                [mongoose.Types.ObjectId(req.params.userId)],
              ],
            },
          },
        },
        {
          $lookup: {
            from: "posts",
            localField: "users",
            foreignField: "user",
            as: "posts",
          },
        },
        {
          $unwind: {
            path: "$posts",
          },
        },
        {
          $sort: {
            "posts.createdAt": -1,
          },
        },
        {
          $group: {
            _id: "$_id",
            posts: {
              $push: "$posts",
            },
            name: { $first: "$name" },
          },
        },
        // added stages
        {
          $unwind: "$posts",
        },
        {
          $lookup: {
            from: "users",
            localField: "posts.user",
            foreignField: "_id",
            as: "posts.user",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            posts: {
              _id: 1,
              user: { $arrayElemAt: ["$posts.user", 0] },
              post: 1,
              likes: 1,
              createdAt: 1,
              updatedAt: 1,
              __v: 1,
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            posts: {
              $push: {
                _id: "$posts._id",
                user: {
                  _id: "$posts.user._id",
                  name: "$posts.user.name",
                },
                post: "$posts.post",
                likes: "$posts.likes",
                createdAt: "$posts.createdAt",
                updatedAt: "$posts.updatedAt",
                __v: "$__v",
              },
            },
          },
        },
      ]);

      let result =
        userAndFriendsPosts.length === 0 ? {} : userAndFriendsPosts[0];

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  getUserPosts: async function (req, res, next) {
    try {
      const posts = await Post.find({ user: req.params.userId }).populate("user","name");
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  },
  like: async function (req, res, next) {
    try {
      const postId = req.params.postId;
      const userId = req.body.userId;
      let post = await Post.findById(postId);

      if (!post) {
        const err = new Error("post is not found");
        err.statusCode = 404;
        return next(err);
      }

      // check if userId exist in post.likes
      if (post.likes.indexOf(userId) !== -1) {
        const err = new Error(`userId: ${userId} already in likes list`);
        err.statusCode = 400;
        return next(err);
      }

      post.likes.push(userId);
      await post.save();
      post = await Post.findById(postId).populate("likes", "name");

      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  dislike: async function (req, res, next) {
    try {
      const postId = req.params.postId;
      const userId = req.body.userId;
      let post = await Post.findById(postId);

      if (!post) {
        const err = new Error("post is not found");
        err.statusCode = 404;
        return next(err);
      }

      // check if userId does not exist in post.likes
      if (post.likes.indexOf(userId) === -1) {
        const err = new Error(`this userId does not exist in likes list`);
        err.statusCode = 400;
        return next(err);
      }

      post = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: userId,
          },
        },
        { new: true }
      ).populate("likes", "name");

      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  },
  getPostLikes: async function (req, res, next) {
    try {
      const postId = req.params.postId;
      let post = await Post.findById(postId).populate("likes", "_id name");

      if (!post) {
        const err = new Error("post is not found");
        err.statusCode = 404;
        return next(err);
      }

      res.status(200).json(post.likes);
    } catch (error) {
      next(error);
    }
  },
};

// [
//   {
//     name: "mohammed",
//     email: "mohammed@gmail.com",
//     gender: "male",
//     dateOfBirth: "12-20-1997",
//     password: "12345678",
//   },
//   {
//     name: "omer",
//     email: "omer@gmail.com",
//     gender: "male",
//     dateOfBirth: "12-20-1997",
//     password: "12345678",
//   },
//   {
//     name: "ali",
//     email: "ali@gmail.com",
//     gender: "male",
//     dateOfBirth: "12-20-1997",
//     password: "12345678",
//   },
//   {
//     name: "abas",
//     email: "abas@gmail.com",
//     gender: "male",
//     dateOfBirth: "12-20-1997",
//     password: "12345678",
//   },
//   {
//     name: "john",
//     email: "john@gmail.com",
//     gender: "male",
//     dateOfBirth: "12-20-1997",
//     password: "12345678",
//   },
//   {
//     name: "deng",
//     email: "deng@gmail.com",
//     gender: "male",
//     dateOfBirth: "12-20-1997",
//     password: "12345678",
//   },
// ]
