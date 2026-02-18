const express = require("express");
const router = express.Router();
const controller = require("./invite.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

console.log('first')

router.get("/:token", controller.validateInvite);

router.post("/accept", jwtValidation, controller.acceptInvite);

module.exports = router;
