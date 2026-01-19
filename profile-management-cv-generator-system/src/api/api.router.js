const express = require("express");
const router = express.Router();

const userRouter = require("./user/user.router");
const profileRouter = require("./profile/profile.router");
const educationRouter = require("./education/education.router");
const experienceRouter = require("./experience/experience.router");
const skillRouter = require("./skill/skill.router");
const cvRouter = require("./cv/cv.router");
const certificateRouter = require("./certificate/certificate.router");
const conferenceAndCoursesRouter = require("./conferenceandcourses/conferenceandcourses.router");
const hobbyRouter = require("./hobby/hobby.routes");
const referenceRouter = require("./reference/reference.routes");

router.use("/users", userRouter);
router.use("/profile", profileRouter);
router.use("/education", educationRouter);
router.use("/experience", experienceRouter);
router.use("/skills", skillRouter);
router.use("/cv", cvRouter);
router.use("/certificates", certificateRouter);
router.use("/conference-and-courses", conferenceAndCoursesRouter);
router.use("/hobbies", hobbyRouter);
router.use("/references", referenceRouter);

module.exports = router;
