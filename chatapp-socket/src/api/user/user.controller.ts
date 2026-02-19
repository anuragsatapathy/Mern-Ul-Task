import { Request, Response } from "express";
import * as service from "./user.service";
import responses from "../../utility/response";

const getUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const data = await service.getUsers(req.user!);
    return responses.successResponse(res, data);
  } catch (e) {
    return responses.internalFailureResponse(res);
  }
};

const searchUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { keyword } = req.query;
    const data = await service.searchUsers(req.user!, keyword as string);
    return responses.successResponse(res, data);
  } catch (e) {
    return responses.internalFailureResponse(res);
  }
};

export { getUsers, searchUsers };
