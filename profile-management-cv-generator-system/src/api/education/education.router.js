const express = require("express");
const router = express.Router();

const educationController = require("./education.controller");
const universalAuth = require("../../middlewares/universalAuth");

router.post("/", universalAuth, educationController.addEducation);
router.get("/", universalAuth, educationController.getEducation);
router.put("/:id", universalAuth, educationController.updateEducation);
router.delete("/:id", universalAuth, educationController.deleteEducation);

module.exports = router;

