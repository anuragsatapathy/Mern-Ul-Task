const goalService = require("./goal.service");
const responses = require("../../utility/response");

const createGoal = async (req, res) => {
  try {
    console.log("CREATE GOAL BODY", req.body);

    const result = await goalService.createGoal(req.body);

    if (result.status !== 200) {
      console.error("CREATE GOAL FAILED", result.message);
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data, result.message);
  } catch (err) {
    console.error("CREATE GOAL ERROR ", err.message);
    return responses.internalFailureResponse(res, err.message);
  }
};

const getGoals = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const result = await goalService.getGoals(page, limit);

    if (result.status !== 200)
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );

    return responses.successResponse(res, result.data, result.message);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message);
  }
};

const getGoalById = async (req, res) => {
  try {
    const result = await goalService.getGoalById(req.params.id);

    if (result.status !== 200)
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );

    return responses.successResponse(res, result.data, result.message);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message);
  }
};

const updateGoal = async (req, res) => {
  try {
    const result = await goalService.updateGoal(req.params.id, req.body);

    if (result.status !== 200)
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );

    return responses.successResponse(res, result.data, result.message);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message);
  }
};

const deleteGoal = async (req, res) => {
  try {
    const result = await goalService.deleteGoal(req.params.id);

    if (result.status !== 200)
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );

    return responses.successResponse(res, result.data, result.message);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message);
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};

