const express = require("express"); const router = express.Router(); const projectController = require("./project.controller"); const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, projectController.createProject);
router.get("/", jwtValidation, projectController.getProjects);
router.get("/:id", jwtValidation, projectController.getProjectById);
router.put("/:id", jwtValidation, projectController.updateProject);
router.delete("/:id", jwtValidation, projectController.deleteProject);

module.exports = router;
