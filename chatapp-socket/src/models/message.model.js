const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    senderId: String,
    receiverId: String,
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", schema);
