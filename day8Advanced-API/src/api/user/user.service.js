const { User } = require('../../models/user.model');
const { AppError } = require('../../middlewares/error.middleware');


const buildQueryFromValid = (validQuery = {}) => {
  const { page = 1, limit = 10, search, sort, fields } = validQuery;
  const skip = (page - 1) * limit;

  // base filter: only active users
  const filter = { isActive: true };

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  // sort parsing
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

const getUsers = async (validQuery) => {
  const { filter, skip, limit, sortObj, select } = buildQueryFromValid(validQuery);

  const [items, total] = await Promise.all([
    User.find(filter).select(select).sort(sortObj).skip(skip).limit(limit).lean(),
    User.countDocuments(filter)
  ]);

  return { items, total };
};

const getUserById = async (id) => {
  const user = await User.findOne({ _id: id, isActive: true }).lean();
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const createUser = async (payload) => {
  const user = new User(payload);
  await user.save();
  return user.toObject();
};

const updateUser = async (id, payload) => {
  const user = await User.findOneAndUpdate({ _id: id, isActive: true }, payload, { new: true }).lean();
  if (!user) throw new AppError('User not found or inactive', 404);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  if (!user) throw new AppError('User not found', 404);
  return user;
};

/* Aggregations */
const countUsers = async () => {
  const [total, active, inactive] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false })
  ]);
  return { total, active, inactive };
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  countUsers
};
