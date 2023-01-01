const Conversation = require("../models/conversation.model");
const getErrorObject = require("../helpers/getErrorObject");
const { ObjectId } = require("mongoose").Types;

const sendMessage = async function (req, res) {
  try {
    // return res.send("post new message");
    let { from, to, message } = req.body;
    let conversation = await Conversation.findOne({
      $or: [
        { firstUser: from, secondUser: to },
        { firstUser: to, secondUser: from },
      ],
    });

    if (!conversation) {
      // if not found create new one
      let newConv = new Conversation({
        firstUser: from,
        secondUser: to,
        messages: [
          {
            from,
            to,
            message,
          },
        ],
      });
      newConv = await newConv.save();
      return res.status(200).json(newConv);
    }
    // update existing conversation
    let updateConv = await Conversation.updateOne(
      {
        $or: [{ firstUser: from }, { secondUser: from }],
      },
      {
        $push: {
          messages: {
            from,
            to,
            message,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json(updateConv);
  } catch (error) {
    let errorObj = getErrorObject(error);
    res.status(400).json(errorObj);
  }
};

const getUserConversations = async function (req, res, next) {
  try {
    let userId = req.params.userId;

    let userConversations = await Conversation.aggregate([
      {
        $match: {
          $or: [
            {
              firstUser: ObjectId(userId),
            },
            {
              secondUser: ObjectId(userId),
            },
          ],
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          firstUser: { $first: "$firstUser" },
          secondUser: { $first: "$secondUser" },
          createdAt: { $first: "$createdAt" },
          lastMessage: {
            $first: "$messages",
          },
        },
      },
    ]);
    res.status(200).json(userConversations);
  } catch (error) {
    next(error);
  }
};

const getConvMessages = async function (req, res, next) {
  try {
    let { firstUser, secondUser } = req.query;

    let convMessages = await Conversation.aggregate([
      {
        $match: {
          $or: [
            {
              firstUser: ObjectId(firstUser),
              secondUser: ObjectId(secondUser),
            },
            {
              firstUser: ObjectId(secondUser),
              secondUser: ObjectId(firstUser),
            },
          ],
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    let messages = convMessages[0]?.messages;

    res.status(200).json(messages || []);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getUserConversations,
  getConvMessages,
};
