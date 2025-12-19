const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
