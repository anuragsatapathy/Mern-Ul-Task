const Expense = require("../../models/expenseModel");
const mongoose = require("mongoose");

const getDashboardAnalytics = async (userId) => {
  const startOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Total monthly spending
  const total = await Expense.aggregate([
    {
      $match: {
        userId: userObjectId,
        isDeleted: false,
        createdAt: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  //Category-wise spending
  const categories = await Expense.aggregate([
    {
      $match: {
        userId: userObjectId,
        isDeleted: false,
        createdAt: { $gte: startOfMonth },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
  ]);

  //Recent expenses
  const recentExpenses = await Expense.find({
    userId: userObjectId,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    totalSpending: total[0]?.total || 0,
    categoryWise: categories,
    recentExpenses,
  };
};

module.exports = { getDashboardAnalytics };

