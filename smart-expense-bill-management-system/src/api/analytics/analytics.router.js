const express = require("express");
const router = express.Router();
const analyticsController = require("./analytics.controller");
const auth = require("../../middlewires/auth");

router.get("/dashboard", auth, analyticsController.getDashboard);

module.exports = router;
