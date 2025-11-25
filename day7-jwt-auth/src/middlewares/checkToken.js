const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { error } = require('../utility/responses');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return error(res, 'No token provided', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return error(res, 'User not found', 401);

    req.user = user; // attach user
    next();
  } catch (err) {
    console.error(err);
    return error(res, 'Invalid or expired token', 401);
  }
};
