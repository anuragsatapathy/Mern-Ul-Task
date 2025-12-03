const { Task } = require("../../models/taskModel");
const { List } = require("../../models/listModel");

// Create Task
const createTask = async (listId, data) => {
  try {
    const list = await List.findById(listId);
    if (!list) return { status: 404, message: "List not found", data: null };

    data.listId = listId;
    const task = new Task(data);
    await task.save();

    return { status: 200, message: "Task created successfully", data: task };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

// Get Tasks
const getTasks = async (query) => {
  try {
    const { listId } = query;

    const tasks = await Task.find({
      listId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    return { status: 200, data: tasks || [] };
  } catch (error) {
    return { status: 500, message: error.message, data: [] };
  }
};

// Update Task
const updateTask = async (id, updateData) => {
  try {
    // Handle completion toggle
    if (updateData.isCompleted === true) {
      updateData.completedAt = new Date();
    }
    if (updateData.isCompleted === false) {
      updateData.completedAt = null;
    }

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!task) return { status: 404, message: "Task not found", data: null };

    return { status: 200, message: "Task updated successfully", data: task };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

// Soft Delete Task
const deleteTask = async (id) => {
  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!task) return { status: 404, message: "Task not found", data: null };

    return { status: 200, message: "Task deleted successfully", data: task };
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

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
