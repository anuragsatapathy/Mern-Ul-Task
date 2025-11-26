const Task = require('./task.model');

const createTask = async (payload) => {
  const task = new Task(payload);
  return await task.save();
};

const getTasksByList = async (listId) => Task.find({ listId }).sort({ createdAt: -1 });

const updateTask = async (id, payload) => Task.findByIdAndUpdate(id, payload, { new: true });

const deleteTask = async (id) => Task.findByIdAndDelete(id);

const deleteTasksByListId = async (listId) => Task.deleteMany({ listId });

module.exports = { createTask, getTasksByList, updateTask, deleteTask, deleteTasksByListId };
