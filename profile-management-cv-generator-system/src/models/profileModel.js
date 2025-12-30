const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    phone: String,
    address: String,
    summary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
