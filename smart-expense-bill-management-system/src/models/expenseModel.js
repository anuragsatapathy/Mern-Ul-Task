const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    category: String,
    paymentType: String,
    date: Date,
    bill: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
