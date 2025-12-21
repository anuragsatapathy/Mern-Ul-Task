const User = require("../../models/studentModel");

const createUser = async (data) => {
  try {
    

    const user = new User(data);
    await user.save();

    return {
      status: 200,
      message: "User created successfully!",
      data: user,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getUsers = async () => {
  return await User.find({ isDeleted: false });
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

const deleteUser = async (id) => {
  const task = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return task;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
