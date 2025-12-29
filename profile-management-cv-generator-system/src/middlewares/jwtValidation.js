const jwt = require("jsonwebtoken");
const responses = require("../utility/response");

const jwtValidation = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return responses.authFailureResponse(res, "Token required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    return responses.authFailureResponse(res, "Invalid token");
  }
};

module.exports = jwtValidation;
