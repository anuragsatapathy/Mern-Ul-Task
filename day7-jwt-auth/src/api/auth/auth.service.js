const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../../models/user.model');
const { sendResetEmail } = require('../../utility/email.util'); // we'll implement a stub
const saltRounds = 10;

const createUser = async (payload) => {
  const user = new User(payload);
  return await user.save();
};

const register = async ({ name, email, password }) => {
  // check existing
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 400;
    throw err;
  }

  const hashed = await bcrypt.hash(password, saltRounds);
  // use service-level createUser
  const created = await createUser({ name, email, password: hashed });
  // remove password before returning
  const obj = created.toObject();
  delete obj.password;
  return obj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const payload = { id: user._id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

  const userObj = user.toObject();
  delete userObj.password;

  return { token, user: userObj };
};


const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal whether email exists
    return;
  }
  // generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  // store hash and expiry on user (add fields)
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:${process.env.PORT || 5000}/api/auth/reset-password/${resetToken}`;
  // send email (stub)
  await sendResetEmail(user.email, resetUrl);
};

const resetPassword = async (token, newPassword) => {
  const cryptoHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: cryptoHash,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    const err = new Error('Invalid or expired password reset token');
    err.status = 400;
    throw err;
  }

  user.password = await bcrypt.hash(newPassword, saltRounds);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

module.exports = { register, login, forgotPassword, resetPassword, createUser };





