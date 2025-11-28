const { Task } = require("../../models/taskModel");
const { List } = require("../../models/listModel");

const createTask = async (data) => {
  try {
    
    const list = await List.findById(data.listId);
    if (!list) {
      return { status: 404, message: "List not found", data: null };
    }

    const task = new Task(data);
    await task.save();
    return { status: 200, message: "Task created successfully", data: task };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getTasks = async () => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return { status: 200, data: tasks };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getTaskById = async (id) => {
  try {
    const task = await Task.findById(id);
    if (!task) return { status: 404, message: "Task not found", data: null };
    return { status: 200, data: task };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const updateTask = async (id, updateData) => {
  try {
    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!task) return { status: 404, message: "Task not found", data: null };
    return { status: 200, message: "Task updated successfully", data: task };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const deleteTask = async (id) => {
  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return { status: 404, message: "Task not found", data: null };
    return { status: 200, message: "Task deleted successfully", data: task };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};

