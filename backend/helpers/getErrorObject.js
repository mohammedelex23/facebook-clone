const { default: mongoose } = require("mongoose");

const getErrorObject = function (error) {
  // mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = [];

    for (let errName in error.errors) {
      if (error.errors[errName].name === "CastError") {
        errors.push({
          name: errName,
          message:
            errName === "dateOfBirth"
              ? "invalid date format"
              : `invalid ${errName}`,
        });
      } else {
        errors.push({
          name: errName,
          message: error.errors[errName].message,
        });
      }
    }

    return {
      type: "ValidationError",
      errors,
    };
  } else if (error.code === 11000) {
    return {
      type: "ValidationError",
      errors: [
        {
          name: "email",
          message: "this email is already registered",
        },
      ],
    };
  } else {
    return {
      message: error.message,
    };
  }
};

module.exports = getErrorObject;
