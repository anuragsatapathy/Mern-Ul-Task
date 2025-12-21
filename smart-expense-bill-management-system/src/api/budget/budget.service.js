const Budget = require("../../models/budgetModel");

const setBudget = async (data) => {
  const budget = await Budget.findOneAndUpdate(
    { userId: data.userId },
    data,
    { new: true, upsert: true }
  );

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
