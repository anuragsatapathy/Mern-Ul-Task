const express = require("express");
const router = express.Router();

const controller = require("./workspacemember.controller");
const jwtValidation = require("../../middlewares/jwtValidation");
const roleGuard = require("../../middlewares/roleGuard");

router.post(
  "/:workspaceId/add",
  jwtValidation,
  roleGuard(["OWNER", "ADMIN"]),
  controller.addMember
);

router.put(
  "/:workspaceId/role",
  jwtValidation,
  roleGuard(["OWNER"]),
  controller.updateRole
);

router.delete(
  "/:workspaceId/remove",
  jwtValidation,
  roleGuard(["OWNER", "ADMIN"]),
  controller.removeMember
);


module.exports = router;
