const successResponse = (res, data, message = "Success") => {
  return res.status(200).json({ success: true, message, data });
};

const errorResponse = (res, message = "Error", status = 400) => {
  return res.status(status).json({ success: false, message });
};

module.exports = { successResponse, errorResponse };
