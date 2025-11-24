class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const { errorResponse } = require('../utility/responses');

  if (!err) return next();

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const payload = { message };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }

  return errorResponse(res, payload, message, status);
};

module.exports = { AppError, errorHandler };
