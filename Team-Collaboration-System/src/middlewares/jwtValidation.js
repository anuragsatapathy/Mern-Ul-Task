const jwt = require("jsonwebtoken");
const responses = require("../utility/response");

const jwtValidation = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responses.authFailureResponse(res, "Authorization token missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return responses.authFailureResponse(res, "Invalid or expired token");
  }
};

module.exports = jwtValidation;
