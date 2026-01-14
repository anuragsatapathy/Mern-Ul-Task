const express = require("express");
const router = express.Router();

const experienceController = require("./experience.controller");
const universalAuth = require("../../middlewares/universalAuth");

// Add Experience
router.post("/", universalAuth, experienceController.addExperience);

// Get Experience
router.get("/", universalAuth, experienceController.getExperience);

// Update Experience
router.put("/:id", universalAuth, experienceController.updateExperience);

// Delete Experience
router.delete("/:id", universalAuth, experienceController.deleteExperience);

module.exports = router;
