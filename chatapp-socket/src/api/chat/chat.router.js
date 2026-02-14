const router = require("express").Router();
const controller = require("./chat.controller");
const jwtValidation = require("../../middlewire/jwtvalidation");


router.post("/", jwtValidation, controller.createChat);
router.get("/", jwtValidation, controller.getChats);

module.exports = router;
