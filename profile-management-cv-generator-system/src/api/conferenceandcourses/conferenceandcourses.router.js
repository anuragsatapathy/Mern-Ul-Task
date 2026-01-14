const express = require("express");
const router = express.Router();

const controller = require("./conferenceandcourses.controller");
const universalAuth = require("../../middlewares/universalAuth");

router.post("/", universalAuth, controller.createConferenceAndCourse);
router.get("/", universalAuth, controller.getConferenceAndCourses);
router.get("/:id", universalAuth, controller.getConferenceAndCourseById);
router.put("/:id", universalAuth, controller.updateConferenceAndCourse);
router.delete("/:id", universalAuth, controller.deleteConferenceAndCourse);

module.exports = router;
