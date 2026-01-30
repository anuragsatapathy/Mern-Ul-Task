const express = require("express");
const router = express.Router();
const controller = require("./invite.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

// Validate invite (public)
router.get("/:token", controller.validateInvite);

// Accept invite (MUST be authenticated)
router.post("/accept", jwtValidation, controller.acceptInvite);

module.exports = router;
