import Message from "../../models/message.model";

const getMessages = async (
  currentUserId: string,
  otherUserId: string
) => {
  return Message.find({
    $or: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId },
    ],
  }).sort({ createdAt: 1 });
};

export { getMessages };
