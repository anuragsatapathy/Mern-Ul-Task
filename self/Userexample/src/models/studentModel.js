const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", studentSchema);
