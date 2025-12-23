const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const auth = require("../../middlewires/auth");

router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/me", auth, userController.getMe);

//  reset password
router.post("/reset-password", auth, userController.resetPassword);

module.exports = router;
