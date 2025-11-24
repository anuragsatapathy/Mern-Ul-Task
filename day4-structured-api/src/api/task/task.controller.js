const TaskService = require("./task.service");

// GET /api/tasks
const getTasks = (req, res, next) => {
  try {
    const tasks = TaskService.getAllTasks(req.query);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/id
const getTask = (req, res, next) => {
  try {
    const task = TaskService.getTaskById(req.params.id);
    if (!task) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
const addTask = (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      const err = new Error("Title is required");
      err.status = 400;
      throw err;
    }
    const newTask = TaskService.createTask({ title, description });
    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/id
const updateTask = (req, res, next) => {
  try {
    const updated = TaskService.updateTask(req.params.id, req.body);
    if (!updated) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/id
const deleteTask = (req, res, next) => {
  try {
    const deleted = TaskService.deleteTask(req.params.id);
    if (!deleted) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }
    res.json({ success: true, message: "Task deleted", data: deleted });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/id/complete
const completeTask = (req, res, next) => {
  try {
    const updated = TaskService.markComplete(req.params.id);
    if (!updated) {
      const err = new Error("Task not found");
      err.status = 404;
      throw err;
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask,
  completeTask
};
