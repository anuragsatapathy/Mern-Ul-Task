const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) {
    return { status: 409, message: "User already exists" };
  }

  data.password = await bcrypt.hash(data.password, 10);
  const user = await User.create(data);

  return { status: 200, data: user };
};

const loginUser = async (data) => {
  const user = await User.findOne({ email: data.email });
  if (!user) return { status: 401, message: "Invalid credentials" };

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) return { status: 401, message: "Invalid credentials" };

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return { status: 200, data: { token } };
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("name email");
  return { status: 200, data: user };
};

const resetPassword = async (userId, password) => {
  if (!/[!@#$%^&*]/.test(password)) {
    return {
      status: 400,
      message: "Password must contain a special character",
    };
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(userId, { password: hashed });

  return { status: 200, message: "Password reset successful" };
};

module.exports = {
  createUser,
  loginUser,
  getMe,
  resetPassword,
};
