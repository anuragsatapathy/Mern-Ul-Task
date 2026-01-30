const prisma = require("../config/db");
const responses = require("../utility/response");

const roleGuard = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const workspaceId =
        req.params.id ||
        req.params.workspaceId ||
        req.body.workspaceId ||
        req.query.workspaceId;

      if (!workspaceId) {
        return responses.badRequestResponse(res, "workspaceId is required");
      }

      const member = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.user.id,
            workspaceId,
          },
        },
      });

      if (!member) {
        return responses.authFailureResponse(
          res,
          "You are not a workspace member"
        );
      }

      if (!allowedRoles.includes(member.role)) {
        return responses.authFailureResponse(
          res,
          "Insufficient permission"
        );
      }
      
      req.workspaceRole = member.role.toLowerCase();

      next();
    } catch (err) {
      return responses.internalFailureResponse(res, err);
    }
  };
};

module.exports = roleGuard;
