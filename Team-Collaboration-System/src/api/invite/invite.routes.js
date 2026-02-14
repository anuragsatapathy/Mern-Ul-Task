const express = require("express");
const router = express.Router();
const controller = require("./invite.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

console.log('first')
// ✅ Validate invite (PUBLIC)
router.get("/:token", controller.validateInvite);

// ✅ Accept invite (AUTH REQUIRED)
router.post("/accept", jwtValidation, controller.acceptInvite);

module.exports = router;
