const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async function authenticateUser(req, res, next) {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      const err = new Error("please send token with request header");
      err.statusCode = 400;
      return next(err);
    }
    // deode token
    const decodedToken = await jwt.verify(
      auth.split(" ")[1],
      process.env.SECRET
    );

    // look on db if user exist
    // let baseUrlArray = req.baseUrl.split("/");
    // let searchId =
    //   baseUrlArray.indexOf("posts") === -1
    //     ? req.params.userId
    //     : req.body.userId;
    let user = await User.findById(req.body.userId || req.params.userId).select(
      "-photo"
    );

    if (!user) {
      const err = new Error("user is not found");
      err.statusCode = 404;
      return next(err);
    }

    // compare id in token with userId in params or allow if user is admin
    if (
      decodedToken.id !== req.body.userId &&
      decodedToken.id !== req.params.userId &&
      !decodedToken.isAdmin
    ) {
      const err = new Error("you are not authorized");
      err.statusCode = 403;
      return next(err);
    }
    // pass
    next();
  } catch (error) {
    next(error);
  }
};
