const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (data) => {
  try {
    
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        status: 409,
        message: "User already exists",
        data: null,
      };
    }

    const user = new User(data);
    user.password = await bcrypt.hash(user.password, 10);

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

const loginUser = async (data) => {
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return {
        status: 401,
        message: "Invalid credentials",
        data: null,
      };
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return {
        status: 401,
        message: "Invalid credentials",
        data: null,
      };
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
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

module.exports = {
  createUser,
  loginUser,
};
