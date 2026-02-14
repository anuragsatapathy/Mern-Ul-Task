const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    participants: [String],
    lastMessage: String,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", schema);
