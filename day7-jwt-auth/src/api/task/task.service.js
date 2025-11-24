const Task = require("../../models/task.model");

class TaskService {
  async createTask(data) {
    return await Task.create(data);
  }

  async getAllTasks(userId) {
    return await Task.find({ user: userId });
  }

  async getTaskById(id, userId) {
    const task = await Task.findOne({ _id: id, user: userId });
    if (!task) throw { status: 404, message: "Task not found" };
    return task;
  }

  async updateTask(id, userId, data) {
    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      data,
      { new: true }
    );
    if (!task) throw { status: 404, message: "Task not found" };
    return task;
  }

  async deleteTask(id, userId) {
    const result = await Task.findOneAndDelete({ _id: id, user: userId });
    if (!result) throw { status: 404, message: "Task not found" };
    return result;
  }
}

module.exports = new TaskService();

