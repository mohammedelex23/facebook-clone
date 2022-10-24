const User = require("../models/user.model");

module.exports = async function (req, res, next) {
  try {
    let { userId } = req.body;
    // validate body
    if (Object.keys(req.body).length === 0) {
      const err = new Error("please send the json object in the request body");
      err.statusCode = 400;
      return next(err);
    }

    // userId validation
    const errors = [];
    if (!userId || userId.trim().length === 0) {
      errors.push({
        name: "userId",
        message: "userId field is required",
      });
    }

    // return validation error
    if (errors.length > 0) {
      return res.status(400).json({
        type: "ValidationError",
        errors,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
