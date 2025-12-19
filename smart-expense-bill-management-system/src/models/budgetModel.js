const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    month: String,
    limit: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
