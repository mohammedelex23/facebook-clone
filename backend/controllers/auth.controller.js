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
        console.log(err || info);
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
      const err = new Error("this email is not registered");
      err.statusCode = 401;
      return next(err);
    }
    let valid = await user.isValidPassword(req.body.password, user.password);
    if (!valid) {
      const err = new Error("invalid email or password");
      err.statusCode = 401;
      return next(err);
    }
    if (!user.isVerified) {
      const err = new Error(
        "your account is not verified yet, check your email for verification."
      );
      err.statusCode = 401;
      return next(err);
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
      const err = new Error("user is not found");
      err.statusCode = 404;
      return next(err);
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
    const email = req.body.email;
    const user = await User.findOne({ email }).select("-photo -password");
    if (!user) {
      const err = new Error("this email is not registered");
      err.statusCode = 401;
      return next(err);
    }

    // send confirmation email
    sendEmail(req.body.email, user._id, user.name, function (err, info) {
      if (err) {
        console.log("Email sent: " + err);
      } else {
        console.log(info);
        res.end();
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
