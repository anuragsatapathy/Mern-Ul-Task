const express = require("express");
const router = express.Router();

const userRouter = require("./user/user.router");
const profileRouter = require("./profile/profile.router");
const educationRouter = require("./education/education.router");
const experienceRouter = require("./experience/experience.router");
const skillRouter = require("./skill/skill.router");
const cvRouter = require("./cv/cv.router");

// NEW ROUTERS
const certificateRouter = require("./certificate/certificate.router");
const conferenceAndCoursesRouter = require("./conferenceandcourses/conferenceandcourses.router");

// MODULE ROUTES
router.use("/users", userRouter);
router.use("/profile", profileRouter);
router.use("/education", educationRouter);
router.use("/experience", experienceRouter);
router.use("/skills", skillRouter);
router.use("/cv", cvRouter);

// NEW MODULE ROUTES
router.use("/certificates", certificateRouter);
router.use("/conference-and-courses", conferenceAndCoursesRouter);

module.exports = router;
