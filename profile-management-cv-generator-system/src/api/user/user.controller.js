const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(409).json({
        isSuccess: false,
        message: "User already exists",
      });
    }

    const user = new User(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    return res.status(200).json({
      isSuccess: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};


const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      isSuccess: true,
      message: "Login successful",
      data: { token },
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
};


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email"
    );

    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        isSuccess: false,
        message: "Password required",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(req.user.id, {
      password: hashed,
    });

    return res.status(200).json({
      isSuccess: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: "Failed to reset password",
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getMe,
  resetPassword,
};
