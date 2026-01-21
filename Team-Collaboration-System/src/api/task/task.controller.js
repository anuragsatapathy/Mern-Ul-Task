const service = require("./task.service");
const responses = require("../../utility/response");

const createTask = async (req, res) => {
  try {
    const result = await service.createTask(req.body);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getTasks = async (req, res) => {
  try {
    const result = await service.getTasks(req.query);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getTaskById = async (req, res) => {
  try {
    const result = await service.getTaskById(req.params.id);
    if (!result.data) return responses.notFoundResponse(res, "Task not found");
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateTask = async (req, res) => {
  try {
    const result = await service.updateTask(req.params.id, req.body);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const deleteTask = async (req, res) => {
  try {
    const result = await service.deleteTask(req.params.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
