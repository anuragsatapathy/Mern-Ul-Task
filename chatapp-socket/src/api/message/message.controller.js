const service = require("./message.service");
const responses = require("../../utility/response");

const getMessages = async (req, res) => {
  try {
    const messages = await service.getMessages(req.params.chatId);
    return responses.successResponse(res, messages);
  } catch (e) {
    return responses.internalFailureResponse(res);
  }
};

module.exports = { getMessages };
