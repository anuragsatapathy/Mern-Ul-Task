const authService = require("./auth.service");
const responses = require("../../utility/response");

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    if (result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data, "User registered successfully");
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    if (result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data, "Login successful");
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = { register, login };
