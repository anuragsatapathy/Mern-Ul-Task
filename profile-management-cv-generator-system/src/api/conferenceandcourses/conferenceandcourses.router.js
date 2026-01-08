const express = require("express");
const router = express.Router();

const controller = require("./conferenceandcourses.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, controller.createConferenceAndCourse);
router.get("/", jwtValidation, controller.getConferenceAndCourses);
router.get("/:id", jwtValidation, controller.getConferenceAndCourseById);
router.put("/:id", jwtValidation, controller.updateConferenceAndCourse);
router.delete("/:id", jwtValidation, controller.deleteConferenceAndCourse);

module.exports = router;
