const jwt = require("jsonwebtoken");
const responses = require("../utility/response");

const jwtValidation = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return responses.authFailureResponse(res, "Token missing");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return responses.authFailureResponse(res, "Invalid token");
  }
};

module.exports = jwtValidation;
