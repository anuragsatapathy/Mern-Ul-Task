import { Request, Response } from "express";
import Message from "../../models/message.model";
import responses from "../../utility/response";

const getMessages = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const currentUserId = req.user!.id;
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

export { getMessages };
