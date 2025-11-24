const userService = require('./user.service');
const { successResponse } = require('../../utility/responses');
const { AppError } = require('../../middlewares/error.middleware');

const getUsers = async (req, res, next) => {
  try {
    const validQuery = req.validQuery || {};
    const { items, total } = await userService.getUsers(validQuery);
    return successResponse(res, { items, total }, 'Users fetched');
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user, 'User fetched');
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, user, 'User created', 201);
  } catch (err) {
    // mongoose duplicate key error
    if (err.code === 11000) return next(new AppError('Email already exists', 400));
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    return successResponse(res, user, 'User soft-deleted');
  } catch (err) {
    next(err);
  }
};

const getUserCounts = async (req, res, next) => {
  try {
    const counts = await userService.countUsers();
    return successResponse(res, counts, 'Counts fetched');
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser, getUserCounts };
