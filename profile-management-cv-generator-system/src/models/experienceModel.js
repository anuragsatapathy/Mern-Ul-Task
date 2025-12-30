const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company: String,
    role: String,
    duration: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);
