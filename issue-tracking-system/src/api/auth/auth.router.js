const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const validation = require("../../middlewares/validation");

// Debug log
console.log("Auth Router: Loaded");

// Register
router.post("/register", validation.validateRegister, authController.register);

// Login
router.post("/login", validation.validateLogin, authController.login);


router.get("/test", (req, res) => {
  res.send("Auth Router Working!");
});

module.exports = router;
