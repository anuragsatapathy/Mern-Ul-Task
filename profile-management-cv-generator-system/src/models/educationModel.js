const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    degree: String,
    branch: String,
    university: String,
    institution: String,

    location: String, 

    cgpa: String,

    startDate: Date,
    endDate: Date,

    description: String,

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", educationSchema);

