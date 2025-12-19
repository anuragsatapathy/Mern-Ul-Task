const Expense = require("../../models/expenseModel");

const createExpense = async (data) => {
  try {
    const expense = new Expense(data);
    await expense.save();
    return { status: 200, message: "Expense added", data: expense };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getExpenses = async ({ limit = 10, offset = 0 }) => {
  const items = await Expense.find({ isDeleted: false })
    .skip(parseInt(offset))
    .limit(parseInt(limit));

  const total = await Expense.countDocuments({ isDeleted: false });
  return { status: 200, data: { items, total } };
};

const updateExpense = async (id, data) => {
  const expense = await Expense.findByIdAndUpdate(id, data, { new: true });
  return { status: 200, data: expense };
};

const deleteExpense = async (id) => {
  const expense = await Expense.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return { status: 200, data: expense };
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
