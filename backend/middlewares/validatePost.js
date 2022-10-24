module.exports = async function (req, res, next) {
  try {
    // validate body
    if (Object.keys(req.body).length === 0) {
      const err = new Error("please send the json object in the request body");
      err.statusCode = 400;
      return next(err);
    }
    let { userId, post } = req.body;
    // userId and post validation
    const errors = [];
    if (!userId || userId.trim().length === 0) {
      errors.push({
        name: "userId",
        message: "userId field is required",
      });
    }

    if (!post || post.trim().length === 0) {
      errors.push({
        name: "post",
        message: "post field is required",
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
