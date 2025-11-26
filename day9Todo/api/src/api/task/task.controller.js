const { success, error } = require('../../utility/responses');
const taskService = require('./task.service');

const createTask = async (req, res) => {
  try {
    const created = await taskService.createTask(req.body);
    return success(res, 'Task created', created, 201);
  } catch (err) { return error(res, err.message); }
};

const getTasksByList = async (req, res) => {
  try {
    const tasks = await taskService.getTasksByList(req.params.listId);
    return success(res, 'Tasks fetched', tasks);
  } catch (err) { return error(res, err.message); }
};

const updateTask = async (req, res) => {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body);
    return success(res, 'Task updated', updated);
  } catch (err) { return error(res, err.message); }
};

const deleteTask = async (req, res) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    return success(res, 'Task deleted', deleted);
  } catch (err) { return error(res, err.message); }
};

module.exports = { createTask, getTasksByList, updateTask, deleteTask };
