const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedinId: String,
    summary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);

