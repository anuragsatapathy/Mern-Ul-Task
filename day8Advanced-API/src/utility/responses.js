const successResponse = (res, data = {}, message = 'success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, error = {}, message = 'error', status = 500) => {
  return res.status(status).json({
    success: false,
    message,
    error
  });
};

module.exports = { successResponse, errorResponse };
