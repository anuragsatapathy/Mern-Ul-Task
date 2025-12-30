const express = require("express");
const router = express.Router();

const userRouter = require("./user/user.router");
const profileRouter = require("./profile/profile.router");
const educationRouter = require("./education/education.router");
const experienceRouter = require("./experience/experience.router");
const skillRouter = require("./skill/skill.router");
const cvRouter = require("./cv/cv.router");

router.use("/users", userRouter);
router.use("/profile", profileRouter);
router.use("/education", educationRouter);
router.use("/experience", experienceRouter);
router.use("/skills", skillRouter);
router.use("/cv", cvRouter);

module.exports = router;
