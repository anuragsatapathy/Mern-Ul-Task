const express = require("express");
const router = express.Router();

const experienceController = require("./experience.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

// Add Experience
router.post("/", jwtValidation, experienceController.addExperience);

// Get Experience
router.get("/", jwtValidation, experienceController.getExperience);

// Update Experience
router.put("/:id", jwtValidation, experienceController.updateExperience);

// Delete Experience
router.delete("/:id", jwtValidation, experienceController.deleteExperience);

module.exports = router;
