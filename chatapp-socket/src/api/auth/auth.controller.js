const service = require("./auth.service");
const responses = require("../../utility/response");

const register = async (req, res) => {
  try {
    const data = await service.register(req.body);
    return responses.successResponse(res, data);
  } catch (e) {
    console.log("REGISTER ERROR:", e.message);
    return responses.badRequestResponse(res, e.message);
  }
};

const login = async (req, res) => {
  try {
    const data = await service.login(req.body);

    if (!data) {
      return responses.authFailureResponse(res, "Invalid email or password");
    }

    return responses.successResponse(res, data);
  } catch (e) {
    console.log("LOGIN ERROR:", e.message);
    return responses.badRequestResponse(res, e.message);
  }
};

module.exports = { register, login };
