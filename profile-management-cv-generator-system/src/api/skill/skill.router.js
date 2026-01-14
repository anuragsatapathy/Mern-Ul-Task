const express = require("express");
const router = express.Router();

const skillController = require("./skill.controller");
const universalAuth = require("../../middlewares/universalAuth");

// Add Skill
router.post("/", universalAuth, skillController.addSkill);

// Get Skills
router.get("/", universalAuth, skillController.getSkill);

// Update Skill
router.put("/:id", universalAuth, skillController.updateSkill);

// Delete Skill
router.delete("/:id", universalAuth, skillController.deleteSkill);

module.exports = router;
