const router = require("express").Router();
const controller = require("./user.controller");
const jwtValidation = require("../../middlewire/jwtvalidation");

router.get("/", jwtValidation, controller.getUsers);
router.get("/search", jwtValidation, controller.searchUsers);

module.exports = router;
