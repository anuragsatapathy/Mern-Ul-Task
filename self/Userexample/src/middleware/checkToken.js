const responses = require("../utility/response");

const checkToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return responses.authFailureResponse(res, "Token missing");
  }
  next();
};

module.exports = checkToken;
