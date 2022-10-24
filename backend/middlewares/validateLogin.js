const validateLogin = function (req, res, next) {
  const errors = [];
  if ((req.body && !req.body.email) || !req.body.email.trim()) {
    errors.push({
      name: "email",
      message: "email is required",
    });
  } else {
    if (req.body && !/.+\@.+\..+/g.test(req.body.email)) {
      errors.push({
        name: "email",
        message: "invalid email",
      });
    }
  }
  if ((req.body && !req.body.password) || !req.body.password.trim()) {
    errors.push({
      name: "password",
      message: "password is required",
    });
  } else {
    if (req.body && req.body.password && req.body.password.length < 8) {
      errors.push({
        name: "password",
        message: "password less than 8 characters",
      });
    }
  }

  if (errors.length === 0) {
    next();
  } else {
    res.status(400).json({
      type: "ValidationError",
      errors,
    });
  }
};

module.exports = validateLogin;
