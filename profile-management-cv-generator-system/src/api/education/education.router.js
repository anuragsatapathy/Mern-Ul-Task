const express = require("express");
const router = express.Router();

const educationController = require("./education.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, educationController.addEducation);
router.get("/", jwtValidation, educationController.getEducation);
router.put("/:id", jwtValidation, educationController.updateEducation);
router.delete("/:id", jwtValidation, educationController.deleteEducation);

module.exports = router;
