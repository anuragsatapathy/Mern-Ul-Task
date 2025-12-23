const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
const createUser = async (data) => {
  try {
    const exists = await User.findOne({ email: data.email, isDeleted: false });
    if (exists) {
      return { status: 409, message: "User already exists", data: null };
    }

    data.password = await bcrypt.hash(data.password, 10);

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

// Login
const loginUser = async (data) => {
  try {
    const user = await User.findOne({ email: data.email, isDeleted: false });
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return { status: 401, message: "Invalid password", data: null };
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      status: 200,
      message: "Login successful",
      data: { token },
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

// Get logged-in user
const getMe = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }

    return {
      status: 200,
      message: "User fetched successfully",
      data: user,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

// reset password
const resetPassword = async (userId, data) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }

    const match = await bcrypt.compare(
      data.currentPassword,
      user.password
    );

    if (!match) {
      return { status: 401, message: "Current password incorrect", data: null };
    }

    user.password = await bcrypt.hash(data.newPassword, 10);
    await user.save();

    return {
      status: 200,
      message: "Password updated successfully",
      data: null,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = {
  createUser,
  loginUser,
  getMe,
  resetPassword,
};
