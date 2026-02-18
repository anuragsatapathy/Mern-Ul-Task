const service = require("./user.service");
const responses = require("../../utility/response");

const getUsers = async (req, res) => {
  try {
    const data = await service.getUsers(req.user);
    return responses.successResponse(res, data);
  } catch (e) {
    return responses.internalFailureResponse(res);
  }
};

const searchUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const data = await service.searchUsers(req.user, keyword);
    return responses.successResponse(res, data);
  } catch (e) {
    return responses.internalFailureResponse(res);
  }
};

module.exports = { getUsers, searchUsers };
