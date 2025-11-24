const { User } = require("../../models/user.model");

const createUser = async (data) => {
  return await User.create(data);
};

const getAllUsers = async (search) => {
  if (search) {
    return await User.find({ name: { $regex: search, $options: "i" } });
  }
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
