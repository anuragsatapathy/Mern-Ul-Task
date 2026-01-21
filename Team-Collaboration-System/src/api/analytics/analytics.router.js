const express = require("express");
const router = express.Router();

const analyticsController = require("./analytics.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.get("/dashboard", jwtValidation, analyticsController.dashboard);

module.exports = router;
