const TaskService = require('./task.service');
const { success, error } = require('../../utility/responses');

class TaskController {
  static async create(req, res) {
    try {
      const task = await TaskService.create(req.body);
      return success(res, task, 'Task created', 201);
    } catch (err) {
      return error(res, err.message || 'Create failed', err.status || 500);
    }
  }

  static async list(req, res) {
    try {
      const status = req.query.status;
      const tasks = await TaskService.list(status);
      return success(res, tasks);
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async getByUser(req, res) {
    try {
      const tasks = await TaskService.getByUser(req.params.userId);
      return success(res, tasks);
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async getById(req, res) {
    try {
      const task = await TaskService.getById(req.params.id);
      if (!task) return error(res, 'Task not found', 404);
      return success(res, task);
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async update(req, res) {
    try {
      const task = await TaskService.update(req.params.id, req.body);
      return success(res, task, 'Task updated');
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async remove(req, res) {
    try {
      await TaskService.remove(req.params.id);
      return success(res, {}, 'Task removed');
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async markComplete(req, res) {
    try {
      const task = await TaskService.markComplete(req.params.id);
      return success(res, task, 'Task marked complete');
    } catch (err) {
      return error(res, err.message);
    }
  }
}

module.exports = TaskController;
