module.exports = function (req, res, next) {
  // check for body existence
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new Error("req.body is not found or empty"));
  }

  const errors = [];
  let { from, to, message } = req.body;
  if (!from || !from.trim()) {
    errors.push({
      field: "from",
      message: "from is required",
    });
  }
  if (!to || !to.trim()) {
    errors.push({
      field: "to",
      message: "to is required",
    });
  }
  if (!message || !message.trim()) {
    errors.push({
      field: "message",
      message: "message is required",
    });
  }

  if (errors.length === 0) {
    if (from === to) {
      return res.status(409).json({
        message: "from is same as to",
      });
    }
    return next();
  }

  res.status(400).json({
    type: "ValidationError",
    errors,
  });
};
