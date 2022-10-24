const User = require("../models/user.model");
const getErrorObject = require("../helpers/getErrorObject");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

//////////////////////////////////////////////////////////////////////////////////
const allUsers = async function (req, res, next) {
  try {
    const users = await User.find({}).select("-password -photo");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const getOneUser = async function (req, res, next) {
  try {
    let user = await User.findById(req.params.userId).select(
      "-password -photo"
    );

    if (!user) {
      const err = new Error("user is not found");
      err.statusCode = 404;
      return next(err);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const updateUser = async function (req, res, next) {
  let user;
  try {
    // if the request body has a password
    if (req.body.password) {
      // validate password length
      if (req.body.password.length < 8) {
        const err = new Error("password less than 8 characters");
        err.statusCode = 400;
        return next(err);
      }

      // check for old password existence
      if (!req.body.oldPassword) {
        const err = new Error("oldPassword is required");
        err.statusCode = 400;
        return next(err);
      }
      user = await User.findById(req.params.userId).select("-photo");
      // return error message if the old password is incorrect;
      let valid = await user.isValidPassword(
        req.body.oldPassword,
        user.password
      );
      if (!valid) {
        const err = new Error("invalid old password");
        err.statusCode = 401;
        return next(err);
      }
    }

    if (Object.keys(req.body).length === 0) {
      const err = new Error("please send the request body in json format");
      err.statusCode = 401;
      return next(err);
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    user.gender = req.body.gender || user.gender;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;

    user = await user.save();
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    const errorObject = getErrorObject(error);
    res.status(400).json(errorObject);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const uploadPhoto = function (req, res, next) {
  try {
    const form = formidable({ multiples: true, uploadDir: "upload" });

    form.parse(req, async function (err, fields, files) {
      if (err) {
        return next(err);
      }
      if (Object.keys(files).length === 0) {
        const err = new Error("please send the photo as a form data");
        err.statusCode = 400;
        return next(err);
      }

      const mimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg"];
      const fileName = files["photo"].newFilename;
      const fileType = files["photo"].mimetype;

      // check image type
      if (mimeTypes.indexOf(fileType) === -1) {
        const err = new Error(
          "please send photo in this one of this formats: (image/jpeg, image/jpg, image/png, image/svg)"
        );
        err.statusCode = 400;
        return next(err);
      }

      // save photo to mongoDB
      let user = await User.findById(req.params.userId).select("-password");
      user.photo = {
        data: fs.readFileSync(
          `D:\\Web Development Projects\\facebook-clone\\upload\\${fileName}`
        ),
        contentType: fileType,
      };
      // delete the photo after saving it to mongoDB
      fs.rm(
        `D:\\Web Development Projects\\facebook-clone\\upload\\${fileName}`,
        function (err) {
          if (err) {
            // File deletion failed
            console.error(err.message);
            return;
          }
          console.log("File deleted successfully");
        }
      );
      await user.save();
      res.status(200).json({ message: "photo uploaded successfully" });
    });
  } catch (error) {}
};

//////////////////////////////////////////////////////////////////////////////////
const getUserPhoto = async function (req, res, next) {
  try {
    let user = await User.findById(req.params.userId).select("photo");
    if (user.photo && user.photo.data) {
      res.set("Content-Type", user.photo.contentType);
      return res.send(user.photo.data);
    }
    next();
  } catch (err) {
    next(err);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const defaultImage = function (req, res, next) {
  console.log(process.cwd());
  let imagePath = path.join(
    process.cwd(),
    "backend",
    "public",
    "images",
    "user.png"
  );
  console.log(imagePath);
  return res.sendFile(imagePath);
};

//////////////////////////////////////////////////////////////////////////////////
const deleteUser = async function (req, res, next) {
  try {
    await User.deleteOne({ _id: req.params.userId });
    res
      .status(200)
      .json({ message: `Successfuly deleted user ${req.params.userId}` });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const sendFriendshipRequest = async function (req, res, next) {
  try {
    //check req.body
    if (Object.keys(req.body).length === 0) {
      const err = new Error("please send the json object in the request body");
      err.statusCode = 400;
      return next(err);
    }
    const receiverId = req.body.receiverId;
    const userId = req.params.userId;

    // return error if userId == receiverId
    if (String(userId) === String(receiverId)) {
      const err = new Error(`userId and receiverId are same`);
      err.statusCode = 403;
      return next(err);
    }

    //check mongoDB for receiverId
    let receiver = await User.findById(receiverId).select("_id");
    if (!receiver) {
      const err = new Error(`user is not found for receiverId ${receiverId}`);
      err.statusCode = 404;
      return next(err);
    }
    // check receiverId on incoming and outgoing friendship in user
    const user = await User.findById(userId).select(
      "incommingRequests outgoingRequests friends"
    );

    // check receiverId on friends
    if (user.friends.includes(receiverId)) {
      const err = new Error(`you are already friends`);
      err.statusCode = 400;
      return next(err);
    }
    // check receiverId on outgoing
    if (user.outgoingRequests.includes(receiverId)) {
      const err = new Error(
        `you already sent request to receiverId: ${receiverId}`
      );
      err.statusCode = 400;
      return next(err);
    }
    // check receiverId on incomming
    if (user.incommingRequests.includes(receiverId)) {
      const err = new Error(
        `user with receiverId: ${receiverId} already sent you request`
      );
      err.statusCode = 400;
      return next(err);
    }
    // update the two users transaction
    const session = await mongoose.connection.startSession();
    await session.withTransaction(async function () {
      // add receiverId to userId outgoingRequests
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            outgoingRequests: receiverId,
          },
        }
      );
      // add userId to receiverId incommingRequests
      await User.updateOne(
        {
          _id: receiverId,
        },
        {
          $push: {
            incommingRequests: userId,
          },
        }
      );
    });
    session.endSession();
    res.status(200).json({
      message: `Successfully sent friendship request to: ${receiverId}`,
    });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const acceptFriendshipRequest = async function (req, res, next) {
  try {
    //check req.body
    if (Object.keys(req.body).length === 0) {
      const err = new Error("please send the json object in the request body");
      err.statusCode = 400;
      return next(err);
    }
    const userId = req.params.userId;
    const requestId = req.body.requestId;
    const user = await User.findById(userId).select("-photo -password");

    // check requestId in userId friends list
    if (user.friends.includes(requestId)) {
      const err = new Error(
        `the requestId: ${requestId} is already in friends list`
      );
      err.statusCode = 400;
      return next(err);
    }

    // check requestId in incomming requests list
    if (!user.incommingRequests.includes(requestId)) {
      const err = new Error("invalid or incorrect requestId");
      err.statusCode = 400;
      return next(err);
    }

    const session = await mongoose.connection.startSession();
    await session.withTransaction(async function () {
      // user with userId:
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: {
            incommingRequests: requestId,
          },
          $push: {
            friends: requestId,
          },
        }
      );

      // user with requestId:
      await User.updateOne(
        {
          _id: requestId,
        },
        {
          $pull: {
            outgoingRequests: userId,
          },
          $push: {
            friends: userId,
          },
        }
      );
    });
    session.endSession();
    res.status(200).json({
      message: `Successfully accepted friendship request from: ${requestId}`,
    });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const cancelFriendshipRequest = async function (req, res, next) {
  try {
    //check req.body
    if (Object.keys(req.body).length === 0) {
      const err = new Error("please send the json object in the request body");
      err.statusCode = 400;
      return next(err);
    }
    const userId = req.params.userId;
    const receiverId = req.body.receiverId;
    const user = await User.findById(userId).select("-photo -password");

    // check receiverId in userId outgoing
    if (!user.outgoingRequests.includes(receiverId)) {
      const err = new Error("invalid or incorrect receiverId");
      err.statusCode = 400;
      return next(err);
    }

    // transaction
    const session = await mongoose.connection.startSession();
    await session.withTransaction(async function () {
      // remove receiverId from outgoing
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: {
            outgoingRequests: receiverId,
          },
        }
      );

      // remove userId from incomming
      await User.updateOne(
        {
          _id: receiverId,
        },
        {
          $pull: {
            incommingRequests: userId,
          },
        }
      );
    });
    session.endSession();
    res.status(200).json({
      message: `Successfully canceled friendship request of receiverId: ${receiverId}`,
    });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const deleteFriendshipRequest = async function (req, res, next) {
  try {
    //check req.body
    if (Object.keys(req.body).length === 0) {
      const err = new Error("please send the json object in the request body");
      err.statusCode = 400;
      return next(err);
    }
    const userId = req.params.userId;
    const requestId = req.body.requestId;
    const user = await User.findById(userId).select("-photo -password");

    // check requestId in userId incomming
    if (!user.incommingRequests.includes(requestId)) {
      const err = new Error("invalid or incorrect requestId");
      err.statusCode = 400;
      return next(err);
    }

    // transaction
    const session = await mongoose.connection.startSession();
    await session.withTransaction(async function () {
      // remove requestId from incommingRequests
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: {
            incommingRequests: requestId,
          },
        }
      );

      // remove userId from incomming
      await User.updateOne(
        {
          _id: requestId,
        },
        {
          $pull: {
            outgoingRequests: userId,
          },
        }
      );
    });
    session.endSession();
    res.status(200).json({
      message: `Successfully deleted incomming friendship request from requestId: ${requestId}`,
    });
  } catch (error) {
    next(error);
  }
};

//////////////////////////////////////////////////////////////////////////////////
const getIncommingFriendshipRequests = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.userId)
      .select("incommingRequests")
      .populate("friends", "name")
      .exec();
    let incommingRequests = user.incommingRequests;
    res.status(200).json(incommingRequests);
  } catch (error) {}
};

//////////////////////////////////////////////////////////////////////////////////
const getFriends = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.userId)
      .select("friends")
      .populate("friends", "name")
      .exec();
    let friends = user.friends;
    res.status(200).json(friends);
  } catch (error) {}
};

module.exports = {
  allUsers,
  updateUser,
  getOneUser,
  uploadPhoto,
  getUserPhoto,
  defaultImage,
  deleteUser,
  sendFriendshipRequest,
  acceptFriendshipRequest,
  cancelFriendshipRequest,
  deleteFriendshipRequest,
  getIncommingFriendshipRequests,
  getFriends,
};
