const express = require("express");
const router = express.Router();
const controller = require("./project.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, controller.createProject);
router.get("/", jwtValidation, controller.getProjects);
router.get("/:id", jwtValidation, controller.getProjectById); 
router.put("/:id", jwtValidation, controller.updateProject);
router.delete("/:id", jwtValidation, controller.deleteProject);

module.exports = router;
