const authService = require("./auth.service");
const responses = require("../../utility/response");

// register
const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data, "Registered successfully");
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

// login
const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data, "Logged in successfully");
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

module.exports = { register, login };
