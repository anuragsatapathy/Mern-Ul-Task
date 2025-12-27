const express = require("express");
const router = express.Router();
const controller = require("./notification.controller");
const auth = require("../../middlewires/auth");

router.get("/", auth, controller.getAll);
router.post("/read", auth, controller.markRead);

module.exports = router;
