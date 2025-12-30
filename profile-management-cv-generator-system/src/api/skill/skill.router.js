const express = require("express");
const router = express.Router();

const skillController = require("./skill.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

// Add Skill
router.post("/", jwtValidation, skillController.addSkill);

// Get Skill
router.get("/", jwtValidation, skillController.getSkill);

// Update Skill
router.put("/:id", jwtValidation, skillController.updateSkill);

// Delete Skill
router.delete("/:id", jwtValidation, skillController.deleteSkill);

module.exports = router;
