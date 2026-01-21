const prisma = require("../config/db");
const responses = require("../utility/response");

const roleGuard = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const workspaceId = req.body.workspaceId || req.query.workspaceId;

      if (!workspaceId) {
        return responses.badRequestResponse(res, "workspaceId is required");
      }

      const member = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId: req.user.id,
        },
      });

      if (!member || !allowedRoles.includes(member.role)) {
        return responses.authFailureResponse(res, "Access denied");
      }

      next();
    } catch (err) {
      return responses.internalFailureResponse(res, err);
    }
  };
};

module.exports = roleGuard;
