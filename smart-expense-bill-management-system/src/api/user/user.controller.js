const userService = require("./user.service");
const responses = require("../../utility/response");

// Register
const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Get logged-in user
const getMe = async (req, res) => {
  try {
    const result = await userService.getMe(req.user.id);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// reset password
const resetPassword = async (req, res) => {
  try {
    const result = await userService.resetPassword(
      req.user.id,
      req.body
    );

    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createUser,
  loginUser,
  getMe,
  resetPassword,
};
