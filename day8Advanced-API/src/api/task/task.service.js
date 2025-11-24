const { Task } = require('../../models/task.model');
const { AppError } = require('../../middlewares/error.middleware');

const buildTaskQuery = (validQuery = {}) => {
  const { page = 1, limit = 10, search, sort, fields } = validQuery;
  const skip = (page - 1) * limit;
  const filter = { isActive: true };

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  let sortObj = { createdAt: -1 };
  if (sort) {
    sortObj = {};
    sort.split(',').forEach(p => {
      p = p.trim();
      if (!p) return;
      if (p.startsWith('-')) sortObj[p.substring(1)] = -1;
      else sortObj[p] = 1;
    });
  }

  const select = fields ? fields.split(',').join(' ') : null;
  return { filter, skip, limit: Number(limit), sortObj, select };
};

const getTasks = async (validQuery) => {
  const { filter, skip, limit, sortObj, select } = buildTaskQuery(validQuery);
  const [items, total] = await Promise.all([
    Task.find(filter).select(select).sort(sortObj).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter)
  ]);
  return { items, total };
};

const getTasksByUserId = async (userId, validQuery) => {
  const { filter, skip, limit, sortObj, select } = buildTaskQuery(validQuery);
  filter.userId = userId;
  const [items, total] = await Promise.all([
    Task.find(filter).select(select).sort(sortObj).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter)
  ]);
  return { items, total };
};

const createTask = async (payload) => {
  const task = new Task(payload);
  await task.save();
  return task.toObject();
};

const updateTask = async (id, payload) => {
  const task = await Task.findOneAndUpdate({ _id: id, isActive: true }, payload, { new: true }).lean();
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

const deleteTask = async (id) => {
  const task = await Task.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  if (!task) throw new AppError('Task not found', 404);
  return task;
};

module.exports = { getTasks, getTasksByUserId, createTask, updateTask, deleteTask };
