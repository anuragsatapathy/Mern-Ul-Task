const generateResponse = (res, isSuccess, message, code, data = null) => {
  return res.status(code).json({ isSuccess, message, code, data });
};

const successResponse = (res, data, message = "success") =>
  generateResponse(res, true, message, 200, data);

const paginatedResponse = (res, data, total, offset) =>
  successResponse(res, { items: data, pagination: { total, offset } });

const badRequestResponse = (res, message) =>
  generateResponse(res, false, message, 400);

const authFailureResponse = (res, message) =>
  generateResponse(res, false, message, 401);

const notFoundResponse = (res, message) =>
  generateResponse(res, false, message, 404);

const internalFailureResponse = (res, data) =>
  generateResponse(res, false, "Internal server error", 500, data);

module.exports = {
  successResponse,
  paginatedResponse,
  badRequestResponse,
  authFailureResponse,
  notFoundResponse,
  internalFailureResponse,
  generateResponse,
};
