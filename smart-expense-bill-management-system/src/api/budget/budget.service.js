const Budget = require("../../models/budgetModel");

const setBudget = async (data) => {
  const budget = new Budget(data);
  await budget.save();
  return { status: 200, data: budget };
};

const getBudget = async (query) => {
  const budget = await Budget.findOne(query);
  return { status: 200, data: budget };
};

module.exports = { setBudget, getBudget };
