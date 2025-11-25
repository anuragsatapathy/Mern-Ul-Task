const User = require('../../models/user.model');

const getAll = async () => {
  return await User.find().select('-password');
};

const getById = async (id) => {
  return await User.findById(id).select('-password');
};

const update = async (id, payload) => {
  
  if (payload.password) delete payload.password;
  return await User.findByIdAndUpdate(id, payload, { new: true }).select('-password');
};

const remove = async (id) => {
  await User.findByIdAndDelete(id);
};

module.exports = { getAll, getById, update, remove };


