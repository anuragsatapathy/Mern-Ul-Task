const User = require("../../models/auth.model");

const getUsers = async () => {
  const users = await User.find({ isDeleted: false }).select("-password");

  return users;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  ).select("-password");

  return user;
};

module.exports = { getUsers, deleteUser };
