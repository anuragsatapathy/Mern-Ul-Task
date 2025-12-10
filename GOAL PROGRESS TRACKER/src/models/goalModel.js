const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    progress: { type: Number, default: 0 }, 
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "ongoing",
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);



