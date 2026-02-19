import { Request, Response, NextFunction } from "express";

interface ApiResponse<T = any> {
  isSuccess: boolean;
  message: string;
  code: number;
  data: T | null;
}

const generateResponse = <T = any>(
  res: Response,
  isSuccess: boolean,
  message: string,
  code: number,
  data: T | null = null
): Response<ApiResponse<T>> => {
  const result: ApiResponse<T> = {
    isSuccess,
    message,
    code,
    data,
  };

  return res.status(code).json(result);
};

const successResponse = <T = any>(
  res: Response,
  data: T,
  message = "success"
): Response<ApiResponse<T>> => {
  return generateResponse(res, true, message, 200, data);
};

const paginatedResponse = <T = any>(
  res: Response,
  data: T,
  total: number,
  offset: number,
  message = "success"
): Response<ApiResponse<any>> => {
  return successResponse(
    res,
    {
      items: data,
      pagination: {
        total,
        offset,
      },
    },
    message
  );
};

const notFoundResponse = (
  res: Response,
  message = "Not found"
): Response<ApiResponse> => {
  return generateResponse(res, false, message, 404);
};

const internalFailureResponse = (
  res: Response,
  data: any = null
): Response<ApiResponse> => {
  return generateResponse(res, false, "internal server error", 500, data);
};

const authFailureResponse = (
  res: Response,
  message = "Unauthorized"
): Response<ApiResponse> => {
  return generateResponse(res, false, message, 401);
};

const conflictResponse = (
  res: Response,
  message = "Conflict"
): Response<ApiResponse> => {
  return generateResponse(res, false, message, 409);
};

const badRequestResponse = (
  res: Response,
  message = "Bad request"
): Response<ApiResponse> => {
  return generateResponse(res, false, message, 400);
};

const comingSoonResponse = (
  _req: Request,
  res: Response,
  _next: NextFunction
): Response<ApiResponse> => {
  return successResponse(res, {}, "Coming soon....");
};

const failedValidationResponse = (
  res: Response,
  errors: any
): Response<ApiResponse> => {
  return generateResponse(res, false, "Validation failed.", 400, { errors });
};

export default {
  successResponse,
  paginatedResponse,
  internalFailureResponse,
  badRequestResponse,
  authFailureResponse,
  notFoundResponse,
  conflictResponse,
  comingSoonResponse,
  failedValidationResponse,
  generateResponse,
};
