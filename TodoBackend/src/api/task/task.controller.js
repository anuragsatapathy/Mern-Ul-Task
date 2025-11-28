const taskService = require("./task.service");
const responses = require("../../utility/response");

// Create Task
const createTask = async (req, res) => {
  try {
    const result = await taskService.createTask(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Get All Tasks
const getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks();
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const result = await taskService.getTaskById(req.params.id);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const result = await taskService.updateTask(req.params.id, req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const result = await taskService.deleteTask(req.params.id);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
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
