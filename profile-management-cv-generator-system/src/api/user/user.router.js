const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

// Create User
router.post("/", userController.createUser);

// Login User
router.post("/login", userController.loginUser);

module.exports = router;

