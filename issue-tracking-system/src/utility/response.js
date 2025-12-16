const generateResponse = (res, isSuccess, message, code, data = null) => {
  const result = {
    isSuccess,
    message,
    code,
    data,
  };
  return res.status(code).json(result);
};

const successResponse = (res, data, message = "success") => {
  return generateResponse(res, true, message, 200, data);
};

const createdResponse = (res, data, message = "created") => {
  return generateResponse(res, true, message, 201, data);
};

const paginatedResponse = (res, data, total, offset, message = "success") => {
  return successResponse(
    res,
    {
      items: data,
      pagination: {
        total: total,
        offset: offset,
      },
    },
    message
  );
};

const notFoundResponse = (res, message = "Not found") => {
  return generateResponse(res, false, message, 404);
};

const internalFailureResponse = (res, data) => {
  return generateResponse(res, false, "internal server error", 500, data);
};

const authFailureResponse = (res, message = "Unauthorized") => {
  return generateResponse(res, false, message, 401);
};

const conflictResponse = (res, message = "Conflict") => {
  return generateResponse(res, false, message, 409);
};

const badRequestResponse = (res, message = "Bad request") => {
  return generateResponse(res, false, message, 400);
};

const failedValidationResponse = (res, errors) => {
  return generateResponse(res, false, "Validation failed.", 400, { errors });
};

module.exports = {
  successResponse,
  createdResponse,
  paginatedResponse,
  internalFailureResponse,
  badRequestResponse,
  authFailureResponse,
  notFoundResponse,
  conflictResponse,
  failedValidationResponse,
  generateResponse,
};
