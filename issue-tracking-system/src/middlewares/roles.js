const responses = require("../utility/response");

const permit = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) return responses.authFailureResponse(res, "Unauthorized");
      if (!allowedRoles.includes(req.user.role)) {
        return responses.generateResponse(res, false, "Forbidden", 403);
      }
      next();
    } catch (err) {
      return responses.internalFailureResponse(res, err.message || err);
    }
  };
};

module.exports = { permit };
