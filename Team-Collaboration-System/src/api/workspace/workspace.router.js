const express = require("express");
const router = express.Router();
const controller = require("./workspace.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, controller.createWorkspace);
router.get("/", jwtValidation, controller.getWorkspaces);
router.get("/:id", jwtValidation, controller.getWorkspaceById);
router.put("/:id", jwtValidation, controller.updateWorkspace);
router.delete("/:id", jwtValidation, controller.deleteWorkspace);

module.exports = router;
