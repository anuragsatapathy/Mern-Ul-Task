import { Request, Response } from "express";
import * as service from "./chat.service";
import responses from "../../utility/response";

const createChat = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data = await service.createChat(req.body);
    return responses.successResponse(res, data);
  } catch {
    return responses.internalFailureResponse(res);
  }
};

const getChats = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data = await service.getChats(req.user!.id);
    return responses.successResponse(res, data);
  } catch {
    return responses.internalFailureResponse(res);
  }
};

export { createChat, getChats };
