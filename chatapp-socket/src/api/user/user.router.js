const router = require("express").Router();
const controller = require("./user.controller");
const jwtValidation = require("../../middlewire/jwtvalidation");

// Protected route
router.get("/", jwtValidation, controller.getUsers);

module.exports = router;
