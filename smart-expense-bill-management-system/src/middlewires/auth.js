const jwt = require("jsonwebtoken");
const responses = require("../utility/response");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return responses.authFailureResponse(res, "Token missing");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return responses.authFailureResponse(res, "Invalid token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return responses.authFailureResponse(res, "Unauthorized user");
  }
};

module.exports = auth;
