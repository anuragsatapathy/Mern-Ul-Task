const Message = require("../../models/message.model");

const getMessages = async (currentUserId, otherUserId) => {
  return Message.find({
    $or: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId },
    ],
  }).sort({ createdAt: 1 });
};

module.exports = { getMessages };
