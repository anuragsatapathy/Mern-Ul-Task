const userService = require("./user.service");
const responses = require("../../utility/response");

// Create User 
const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data, "User created successfully!");
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const q = req.query.q || null;
    const result = await userService.getUsers({ page, limit, q });
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.paginatedResponse(res, result.data.items, result.data.total, result.data.offset);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userService.getUserById(id);
    if (!result || result.status === 404) return responses.notFoundResponse(res, result ? result.message : "User not found");
    if (result.status && result.status !== 200) return responses.generateResponse(res, false, result.message, result.status);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

module.exports = { createUser, getUsers, getUserById };
