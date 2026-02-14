const service = require("./chat.service");
const responses = require("../../utility/response");

const createChat = async (req, res) => {
  try {
    const data = await service.createChat(req.body);
    return responses.successResponse(res, data);
  } catch {
    return responses.internalFailureResponse(res);
  }
};

const getChats = async (req, res) => {
  try {
    const data = await service.getChats(req.user.id);
    return responses.successResponse(res, data);
  } catch {
    return responses.internalFailureResponse(res);
  }
};

module.exports = { createChat, getChats };
