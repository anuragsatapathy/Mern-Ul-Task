const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

// Create User
router.post("/", userController.createUser);

// Login User
router.post("/login", userController.loginUser);

// GET LOGGED-IN USER
router.get("/me", jwtValidation, userController.getMe);

// RESET PASSWORD
router.post("/reset-password", jwtValidation, userController.resetPassword);

module.exports = router;
