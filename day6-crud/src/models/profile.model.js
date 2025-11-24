const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bio: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports.Profile = mongoose.model("Profile", profileSchema);
