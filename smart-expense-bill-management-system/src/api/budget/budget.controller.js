const budgetService = require("./budget.service");
const responses = require("../../utility/response");

const setBudget = async (req, res) => {
  try {
    const data = {
      userId: req.user.id,
      month: req.body.month,
      limit: Number(req.body.limit),
    };

    const result = await budgetService.setBudget(data);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getBudget = async (req, res) => {
  try {
    const result = await budgetService.getBudget(req.user.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  setBudget,
  getBudget,
};
