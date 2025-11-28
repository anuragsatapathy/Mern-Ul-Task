const success = (res, message = 'Success', data = null, code = 200) =>
  res.status(code).json({ isSuccess: true, message, data });

const error = (res, message = 'Error', code = 500, data = null) =>
  res.status(code).json({ isSuccess: false, message, data });

module.exports = { success, error };


