const expenseService = require("./expense.service");
const responses = require("../../utility/response");

const createExpense = async (req, res) => {
  try {
    const result = await expenseService.createExpense(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getExpenses = async (req, res) => {
  try {
    const result = await expenseService.getExpenses(req.query);
    return responses.paginatedResponse(
      res,
      result.data.items,
      result.data.total,
      req.query.offset || 0
    );
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateExpense = async (req, res) => {
  try {
    const result = await expenseService.updateExpense(req.params.id, req.body);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
