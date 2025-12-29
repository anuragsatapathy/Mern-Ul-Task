const userService = require("./user.service");
const responses = require("../../utility/response");

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const loginUser = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createUser,
  loginUser,
};
