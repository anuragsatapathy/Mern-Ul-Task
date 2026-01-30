const express = require("express");
const router = express.Router();

const controller = require("./workspace.controller");
const jwtValidation = require("../../middlewares/jwtValidation");
const roleGuard = require("../../middlewares/roleGuard");

// Invite controller
const inviteController = require("../invite/invite.controller");

// CREATE WORKSPACE
router.post("/", jwtValidation, controller.createWorkspace);

// GET ALL WORKSPACES
router.get("/", jwtValidation, controller.getWorkspaces);

// GET WORKSPACE BY ID
router.get("/:id", jwtValidation, controller.getWorkspaceById);

// UPDATE WORKSPACE
router.put(
  "/:id",
  jwtValidation,
  roleGuard(["OWNER", "ADMIN"]),
  controller.updateWorkspace
);

// DELETE WORKSPACE
router.delete(
  "/:id",
  jwtValidation,
  roleGuard(["OWNER"]),
  controller.deleteWorkspace
);

// GET MEMBERS BY PROJECT
router.get(
  "/members/by-project/:projectId",
  jwtValidation,
  controller.getMembersByProject
);

// END INVITE (OWNER / ADMIN ONLY)
router.post(
  "/:id/invite",
  jwtValidation,
  roleGuard(["OWNER", "ADMIN"]),
  inviteController.sendInvite
);

module.exports = router;
