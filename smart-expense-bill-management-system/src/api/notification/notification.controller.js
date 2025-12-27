const service = require("./notification.service");
const responses = require("../../utility/response");

const getAll = async (req, res) => {
  const data = await service.getNotifications(req.user.id);
  return responses.successResponse(res, data);
};

const markRead = async (req, res) => {
  await service.markAllRead(req.user.id);
  return responses.successResponse(res, null);
};

module.exports = {
  getAll,
  markRead,
};
