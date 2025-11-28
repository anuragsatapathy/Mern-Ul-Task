const { internalFailureResponse } = require("../utility/response");

const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error Handler Caught:", err.message);
  return internalFailureResponse(res, err.message || "Something went wrong");
};

module.exports = { errorHandler };

