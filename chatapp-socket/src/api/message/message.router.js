const router = require("express").Router();
const controller = require("./message.controller");
const jwtValidation = require("../../middlewire/jwtvalidation");

router.get("/:chatId", jwtValidation, controller.getMessages);

module.exports = router;
