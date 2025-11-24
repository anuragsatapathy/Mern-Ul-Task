const taskService = require("./task.service");

class TaskController {
  async create(req, res) {
    try {
      const task = await taskService.createTask(req.user.id, req.body);
      res.status(201).json(task);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async getAll(req, res) {
    try {
      const tasks = await taskService.getTasks(req.user.id);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }

  async getOne(req, res) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      res.json(task);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async update(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await taskService.deleteTask(req.params.id);
      res.json({ message: "Task deleted", deleted });
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async markComplete(req, res) {
    try {
      const updated = await taskService.markComplete(req.params.id);
      res.json(updated);
    } catch (error) {
      res
        .status(error.status || 500)
        .json({ message: error.message || "Something went wrong" });
    }
  }

  async filter(req, res) {
    try {
      const tasks = await taskService.filterByStatus(
        req.user.id,
        req.query.status
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

module.exports = new TaskController();
