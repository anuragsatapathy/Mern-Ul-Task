const budgetService = require("./budget.service");
const responses = require("../../utility/response");

const setBudget = async (req, res) => {
  const result = await budgetService.setBudget(req.body);
  return responses.successResponse(res, result.data);
};

const getBudget = async (req, res) => {
  const result = await budgetService.getBudget(req.query);
  return responses.successResponse(res, result.data);
};

module.exports = { setBudget, getBudget };
