const jwt = require("jsonwebtoken");
const responses = require("../utility/response");

const jwtValidation = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return responses.authFailureResponse(res, "No token provided");
    }

   
    const parsedToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(parsedToken, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return responses.authFailureResponse(res, "Invalid token");
  }
};

module.exports = jwtValidation;
