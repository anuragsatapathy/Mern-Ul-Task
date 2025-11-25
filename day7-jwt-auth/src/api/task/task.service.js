const Task = require('../../models/task.model');

const create = async (payload) => {
  const task = new Task(payload);
  return await task.save();
};

const list = async (status) => {
  const filter = {};
  if (status) filter.status = status;
  return await Task.find(filter).sort({ createdAt: -1 });
};

const getByUser = async (userId) => {
  return await Task.find({ userId }).sort({ createdAt: -1 });
};

const getById = async (id) => {
  return await Task.findById(id);
};

const update = async (id, payload) => {
  return await Task.findByIdAndUpdate(id, payload, { new: true });
};

const remove = async (id) => {
  await Task.findByIdAndDelete(id);
};

const markComplete = async (id) => {
  return await Task.findByIdAndUpdate(id, { status: 'complete' }, { new: true });
};

module.exports = { create, list, getByUser, getById, update, remove, markComplete };


