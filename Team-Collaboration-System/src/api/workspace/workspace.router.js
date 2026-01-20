const express = require("express"); const router = express.Router(); const workspaceController = require("./workspace.controller"); const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, workspaceController.createWorkspace);
router.get("/", jwtValidation, workspaceController.getWorkspaces);
router.get("/:id", jwtValidation, workspaceController.getWorkspaceById);
router.put("/:id", jwtValidation, workspaceController.updateWorkspace);
router.delete("/:id", jwtValidation, workspaceController.deleteWorkspace);

module.exports = router;
