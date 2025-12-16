const User = require("../../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (data) => {
  try {
    if (!data.name || !data.email || !data.password) {
      return { status: 400, message: "name, email and password are required", data: null };
    }

    const existing = await User.findOne({ email: data.email.toLowerCase(), isDeleted: false });
    if (existing) return { status: 409, message: "User with this email already exists", data: null };

    const saltRounds = 10;
    const hashed = await bcrypt.hash(data.password, saltRounds);

    const user = new User({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashed,
      role: data.role || "developer",
    });

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    // create token
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

    return { status: 200, message: "User registered", data: { user: userObj, token } };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const login = async (data) => {
  try {
    if (!data.email || !data.password) return { status: 400, message: "email and password required", data: null };

    const user = await User.findOne({ email: data.email.toLowerCase(), isDeleted: false });
    if (!user) return { status: 401, message: "Invalid credentials", data: null };

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return { status: 401, message: "Invalid credentials", data: null };

    const userObj = user.toObject();
    delete userObj.password;

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "7d" });

    return { status: 200, message: "Login successful", data: { user: userObj, token } };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = { register, login };
