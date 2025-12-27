const expenseService = require("./expense.service");
const responses = require("../../utility/response");

// CREATE (with file upload)
const createExpense = async (req, res) => {
  try {
    const data = {
      amount: req.body.amount,
      category: req.body.category,
      paymentType: req.body.paymentType,
      date: req.body.date,
      userId: req.user.id,
      bill: req.file ? req.file.filename : null,
    };

    const result = await expenseService.createExpense(data);

    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (error) {
    return responses.badRequestResponse(res, error.message);
  }
};

// GET (pagination unchanged)
const getExpenses = async (req, res) => {
  try {
    const result = await expenseService.getExpenses({
      userId: req.user.id,
      limit: req.query.limit,
      offset: req.query.offset,
    });

    return responses.paginatedResponse(
      res,
      result.data.items,
      result.data.total,
      req.query.offset || 0
    );
  } catch (error) {
    return responses.internalFailureResponse(res, error);
  }
};

// UPDATE
const updateExpense = async (req, res) => {
  try {
    const result = await expenseService.updateExpense(
      req.params.id,
      req.body,
      req.user.id   // ✅ REQUIRED for notification
    );

    return responses.successResponse(res, result.data);
  } catch (error) {
    return responses.internalFailureResponse(res, error);
  }
};

// DELETE (soft delete)
const deleteExpense = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(
      req.params.id,
      req.user.id   // ✅ REQUIRED for notification
    );

    return responses.successResponse(res, result.data);
  } catch (error) {
    return responses.internalFailureResponse(res, error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
