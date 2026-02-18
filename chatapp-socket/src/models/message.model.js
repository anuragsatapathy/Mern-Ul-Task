const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 10, 
    },
  },
  { timestamps: true }
);

schema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    ret.senderId = ret.senderId.toString();
    ret.receiverId = ret.receiverId.toString();
    return ret;
  },
});

module.exports = mongoose.model("Message", schema);
