const jwt = require("jsonwebtoken");
const responses = require("../utility/response");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return responses.authFailureResponse(res, "Token required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return responses.authFailureResponse(res, "Invalid token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    return responses.authFailureResponse(res, "Invalid token");
  }
};
