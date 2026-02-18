const Message = require("../../models/message.model");
const responses = require("../../utility/response");

const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;  
    const otherUserId = req.params.chatId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 });

    return responses.successResponse(res, messages);

  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res);
  }
};

module.exports = { getMessages };
