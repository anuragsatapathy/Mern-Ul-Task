exports.success = (res, data = {}, message = 'success', status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

exports.error = (res, message = 'error', status = 500) => {
  return res.status(status).json({ success: false, message });
};
