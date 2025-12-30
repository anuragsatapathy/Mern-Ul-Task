const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    degree: String,
    institution: String,
    startYear: String,
    endYear: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", educationSchema);
