const Budget = require("../../models/budgetModel");
const Expense = require("../../models/expenseModel");
const { createNotification } = require("../notification/notification.service");

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};


const calculateSpent = async (userId) => {
  const expenses = await Expense.find({
    userId,
    isDeleted: false,
  });

  return expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );
};

/* SET / UPDATE BUDGET */
const setBudget = async (data) => {
  const budget = await Budget.findOneAndUpdate(
    { userId: data.userId, month: data.month },
    { limit: Number(data.limit) },
    { new: true, upsert: true }
  );


  await createNotification({
    userId: data.userId,
    title: "Budget Saved",
    message: `Monthly budget of ₹${budget.limit} set for ${budget.month}`,
  });


  const currentMonth = getCurrentMonth();
  if (data.month === currentMonth) {
    const spent = await calculateSpent(data.userId);
    const percent = (spent / Number(budget.limit)) * 100;

    if (percent >= 80 && percent < 100) {
      await createNotification({
        userId: data.userId,
        title: "Budget Warning",
        message: `You have used ${Math.round(percent)}% of your monthly budget`,
      });
    }

    if (percent >= 100) {
      await createNotification({
        userId: data.userId,
        title: "Budget Exceeded",
        message: "Your monthly budget has been exceeded",
      });
    }
  }

  return { status: 200, data: budget };
};


const getBudget = async (userId) => {
  const budget = await Budget.findOne({ userId }).sort({ updatedAt: -1 });
  return { status: 200, data: budget };
};

module.exports = {
  setBudget,
  getBudget,
};
