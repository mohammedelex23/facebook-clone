const User = require("../models/user.model");
const getErrorObject = require("../helpers/getErrorObject");
const getToken = require("../helpers/getToken");
const sendEmail = require("../services/mail/sendEmail");

const signup = async function (req, res, next) {
  try {
    if (req.body && req.body.isAdmin) {
      req.body.isAdmin = false;
    }
    if (req.body && req.body.isVerified) {
      req.body.isVerified = false;
    }

    if (req.body.image) {
      req.body.image = undefined;
    }

    let newUser = new User(req.body);
    newUser = await newUser.save();

    newUser.password = undefined;

    // send confirmation email
    sendEmail(req.body.email, newUser._id, newUser.name, function (err, info) {
      if (err || info) {
        // console.log(err || info);
      }
      res.end();
    });

    res.status(201).json(newUser);
  } catch (error) {
    const errorObject = getErrorObject(error);
    res.status(400).json(errorObject);
  }
};

const login = async function (req, res, next) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    }).select("-photo");
    if (!user) {
      return res.status(401).json({
        type: "NotRegisteredError",
        message: "this email is not registered",
      });
    }
    let valid = await user.isValidPassword(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({
        type: "InvalidError",
        message: "invalid email or password",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        type: "NotVerified",
        userId: user._id,
        message:
          "your account is not verified yet, check your email for verification.",
      });
    }
    user.password = undefined;
    const token = await getToken(user._id, user.isAdmin);
    res.status(200).json({ ...user._doc, token });
  } catch (error) {
    next(error);
  }
};

// verify signup
const verifySignup = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.userId).select(
      "-photo -password"
    );
    // return error if user is not found
    if (!user) {
      return res.status(400).json({
        type: "UserNotFound",
        message: "user is not found",
      });
    }
    // modify user isVerified
    user.isVerified = true;
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

const resendMail = async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select("_id name email");
    if (!user) {
      const err = new Error("user is not found");
      err.statusCode = 401;
      return next(err);
    }

    // send confirmation email
    sendEmail(user.email, user._id, user.name, function (err, info) {
      if (err) {
        return next(err);
      } else {
        // console.log(info);
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  verifySignup,
  resendMail,
};
