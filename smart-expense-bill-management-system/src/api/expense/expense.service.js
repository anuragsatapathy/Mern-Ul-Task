const Expense = require("../../models/expenseModel");
const Budget = require("../../models/budgetModel");
const { createNotification } = require("../notification/notification.service");

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};


const getMonthRange = (month) => {
  const [year, m] = month.split("-");
  const start = new Date(year, m - 1, 1, 0, 0, 0);
  const end = new Date(year, m, 0, 23, 59, 59);
  return { start, end };
};


const checkBudget = async (userId) => {
  const currentMonth = getCurrentMonth();

  const budget = await Budget.findOne({
    userId,
    month: currentMonth,
  });

  if (!budget) return;

  const { start, end } = getMonthRange(currentMonth);

  const totalAgg = await Expense.aggregate([
    {
      $match: {
        userId,
        isDeleted: false,
        createdAt: { $gte: start, $lte: end }, 
      },
    },
    {
      $addFields: {
        amountNumber: { $toDouble: "$amount" }, 
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amountNumber" },
      },
    },
  ]);

  const spent = totalAgg[0]?.total || 0;
  const percent = (spent / Number(budget.limit)) * 100;

  // 80% warning
  if (percent >= 80 && percent < 100) {
    await createNotification({
      userId,
      title: "Budget Warning",
      message: "You have crossed 80% of your monthly budget",
    });
  }

  // 100% exceeded
  if (percent >= 100) {
    await createNotification({
      userId,
      title: "Budget Exceeded",
      message: "Your monthly budget has been exceeded",
    });
  }
};


const createExpense = async (data) => {
  const expense = await Expense.create({
    ...data,
    amount: Number(data.amount), 
  });

  await createNotification({
    userId: data.userId,
    title: "Expense Added",
    message: `₹${expense.amount} added under ${expense.category}`,
  });

  await checkBudget(data.userId);

  return { status: 200, data: expense };
};


const getExpenses = async ({ limit = 10, offset = 0, userId }) => {
  const query = { userId, isDeleted: false };

  const items = await Expense.find(query)
    .skip(Number(offset))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Expense.countDocuments(query);

  return { status: 200, data: { items, total } };
};


const updateExpense = async (id, data, userId) => {
  const expense = await Expense.findByIdAndUpdate(
    id,
    { ...data, amount: Number(data.amount) },
    { new: true }
  );

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
