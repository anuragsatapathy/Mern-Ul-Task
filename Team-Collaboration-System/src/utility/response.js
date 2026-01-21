const generateResponse = (res, isSuccess, message, code, data = null) => {
  return res.status(code).json({
    isSuccess,
    message,
    code,
    data,
  });
};

const successResponse = (res, data, message = "success") => {
  return generateResponse(res, true, message, 200, data);
};

const paginatedResponse = (res, data, total, offset, message = "success") => {
  return successResponse(res, {
    items: data,
    pagination: { total, offset },
  }, message);
};

const notFoundResponse = (res, message) => {
  return generateResponse(res, false, message, 404);
};

const internalFailureResponse = (res, data) => {
  return generateResponse(res, false, "internal server error", 500, data);
};

const authFailureResponse = (res, message) => {
  return generateResponse(res, false, message, 401);
};

const conflictResponse = (res, message) => {
  return generateResponse(res, false, message, 409);
};

const badRequestResponse = (res, message) => {
  return generateResponse(res, false, message, 400);
};

const failedValidationResponse = (res, errors) => {
  return generateResponse(res, false, "Validation failed.", 400, { errors });
};

module.exports = {
  successResponse,
  paginatedResponse,
  internalFailureResponse,
  badRequestResponse,
  authFailureResponse,
  notFoundResponse,
  conflictResponse,
  failedValidationResponse,
  generateResponse,
};
