const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v || !v.trim()) {
            throw new Error("email is required");
          }
          if (!/.+\@.+\..+/g.test(v)) {
            throw new Error("invalid email");
          }
        },
        message: (props) => {
          return props.reason.message;
        },
      },
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v || !v.trim()) {
            throw new Error("password is required");
          }
          if (v.length < 8) {
            throw new Error("password less than 8 characters");
          }
        },
        message: (props) => {
          return props.reason.message;
        },
      },
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["male", "female"],
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) {
            throw new Error("dateOfBirth is required");
          }
          if (!new Date(v).getDate()) {
            throw new Error("invalid date format");
          }
        },
        message: (props) => {
          return props.reason.message;
        },
      },
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    incommingRequests: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    outgoingRequests: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

/////////////// encrypt password before save /////////////
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // password not modified: skip
    next();
  } else {
    // encrypt the password
    try {
      const encryptedPassword = await bcrypt.hash(
        this.password,
        parseInt(process.env.SALT_ROUNDS)
      );
      this.password = encryptedPassword;
      next();
    } catch (error) {
      next(error);
    }
  }
});

//////////////// decrypt password //////////
userSchema.methods.isValidPassword = async function (password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
