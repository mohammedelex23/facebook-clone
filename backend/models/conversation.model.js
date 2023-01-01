const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    isViewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    firstUser: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    secondUser: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
