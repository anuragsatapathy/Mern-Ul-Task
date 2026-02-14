const Message = require("../../models/message.model");

const sendMessage = async (data) => {
  return Message.create(data);
};

const getMessages = async (chatId) => {
  return Message.find({ chatId });
};

module.exports = { sendMessage, getMessages };
