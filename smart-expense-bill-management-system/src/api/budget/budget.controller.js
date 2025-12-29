const budgetService = require("./budget.service");

const setBudget = async (req, res) => {
  const result = await budgetService.setBudget({
    userId: req.user.id,
    month: req.body.month,
    limit: req.body.limit,
  });

  res.status(200).json({
    isSuccess: true,
    data: result.data,
  });
};

const getBudget = async (req, res) => {
  const result = await budgetService.getBudget(req.user.id);

  res.status(200).json({
    isSuccess: true,
    data: result.data,
  });
};

module.exports = {
  setBudget,
  getBudget,
};
