const Budget = require("../../models/budgetModel");
const Expense = require("../../models/expenseModel");
const { createNotification } = require("../notification/notification.service");

const setBudget = async (data) => {
  const budget = await Budget.findOneAndUpdate(
    { userId: data.userId },
    data,
    { new: true, upsert: true }
  );

  const totalAgg = await Expense.aggregate([
    { $match: { userId: data.userId, isDeleted: false } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const spent = totalAgg[0]?.total || 0;
  const percent = (spent / data.limit) * 100;

  if (percent >= 80 && percent < 100) {
    await createNotification({
      userId: data.userId,
      title: "Budget Warning",
      message: "You have crossed 80% of your monthly budget",
    });
  }

  if (percent >= 100) {
    await createNotification({
      userId: data.userId,
      title: "Budget Exceeded",
      message: "Your monthly budget has been exceeded",
    });
  }

  return { status: 200, data: budget };
};

const getBudget = async (userId) => {
  const budget = await Budget.findOne({ userId }).sort({ createdAt: -1 });
  return { status: 200, data: budget };
};

module.exports = {
  setBudget,
  getBudget,
};
