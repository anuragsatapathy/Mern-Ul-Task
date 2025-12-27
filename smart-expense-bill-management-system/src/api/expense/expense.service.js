const Expense = require("../../models/expenseModel");
const Budget = require("../../models/budgetModel");
const { createNotification } = require("../notification/notification.service");

const checkBudget = async (userId) => {
  const budget = await Budget.findOne({ userId });
  if (!budget) return;

  const totalAgg = await Expense.aggregate([
    { $match: { userId, isDeleted: false } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const spent = totalAgg[0]?.total || 0;
  const percent = (spent / budget.limit) * 100;

  if (percent >= 80 && percent < 100) {
    await createNotification({
      userId,
      title: "Budget Warning",
      message: "You have crossed 80% of your budget",
    });
  }

  if (percent >= 100) {
    await createNotification({
      userId,
      title: "Budget Exceeded",
      message: "Your monthly budget has been exceeded",
    });
  }
};

const createExpense = async (data) => {
  const expense = await Expense.create(data);

  await createNotification({
    userId: data.userId,
    title: "Expense Added",
    message: `₹${data.amount} added under ${data.category}`,
  });

  await checkBudget(data.userId);
  return { status: 200, data: expense };
};

const getExpenses = async ({ limit = 10, offset = 0, userId }) => {
  const query = { userId, isDeleted: false };

  const items = await Expense.find(query)
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Expense.countDocuments(query);
  return { status: 200, data: { items, total } };
};

const updateExpense = async (id, data, userId) => {
  const expense = await Expense.findByIdAndUpdate(id, data, { new: true });

  await createNotification({
    userId,
    title: "Expense Updated",
    message: `₹${expense.amount} updated in ${expense.category}`,
  });

  await checkBudget(userId);
  return { status: 200, data: expense };
};

const deleteExpense = async (id, userId) => {
  const expense = await Expense.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  await createNotification({
    userId,
    title: "Expense Deleted",
    message: `₹${expense.amount} removed from ${expense.category}`,
  });

  await checkBudget(userId);
  return { status: 200, data: expense };
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
