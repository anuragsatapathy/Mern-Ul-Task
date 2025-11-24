const taskService = require('./task.service');
const { successResponse } = require('../../utility/responses');

const getTasks = async (req, res, next) => {
  try {
    const validQuery = req.validQuery || {};
    const { items, total } = await taskService.getTasks(validQuery);
    return successResponse(res, { items, total }, 'Tasks fetched');
  } catch (err) {
    next(err);
  }
};

const getTasksByUserId = async (req, res, next) => {
  try {
    const validQuery = req.validQuery || {};
    const { items, total } = await taskService.getTasksByUserId(req.params.userId, validQuery);
    return successResponse(res, { items, total }, 'Tasks fetched by user');
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    return successResponse(res, task, 'Task created', 201);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    return successResponse(res, task, 'Task updated');
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await taskService.deleteTask(req.params.id);
    return successResponse(res, task, 'Task soft-deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTasksByUserId, createTask, updateTask, deleteTask };
