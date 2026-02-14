const Chat = require("../../models/chat.model");

const createChat = async (data) => {
  return Chat.create(data);
};

const getChats = async (userId) => {
  return Chat.find({ participants: userId, isDeleted: false });
};

module.exports = { createChat, getChats };
