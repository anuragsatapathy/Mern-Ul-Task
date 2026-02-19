import { Request, Response } from "express";
import * as service from "./auth.service";
import responses from "../../utility/response";

const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await service.register(req.body);
    return responses.successResponse(res, data);
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Something went wrong";
    console.log("REGISTER ERROR:", errorMessage);
    return responses.badRequestResponse(res, errorMessage);
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const data = await service.login(req.body);

    if (!data) {
      return responses.authFailureResponse(
        res,
        "Invalid email or password"
      );
    }

    return responses.successResponse(res, data);
  } catch (e: unknown) {
    const errorMessage =
      e instanceof Error ? e.message : "Something went wrong";
    console.log("LOGIN ERROR:", errorMessage);
    return responses.badRequestResponse(res, errorMessage);
  }
};

export { register, login };
