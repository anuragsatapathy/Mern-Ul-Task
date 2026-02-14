const User = require("../../models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (data) => {
  const { name, email, password } = data;

  // check duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
  });

  // remove password before sending response
  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

const login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) return null;

  const match = await bcrypt.compare(password, user.password);
  if (!match) return null;

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );

  // remove password before sending
  const userObj = user.toObject();
  delete userObj.password;

  return {
    user: userObj,
    token,
  };
};

module.exports = { register, login };
