const express = require("express");
const router = express.Router();

const controller = require("./activity.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.get("/", jwtValidation, controller.getActivities);

module.exports = router;
