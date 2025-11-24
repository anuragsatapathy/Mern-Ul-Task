const router = require("express").Router();
const authController = require("./auth.controller");

// AUTH ROUTES
router.post("/register", authController.register);
router.post("/login", authController.login);

// NEW ROUTES (Forgot + Reset Password)
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;


