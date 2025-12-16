const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const auth = require("../../middlewares/auth");
const { permit } = require("../../middlewares/roles");

// Create user (admin only)
router.post("/", auth, permit(["admin"]), userController.createUser);

// Get users (admin & tester)
router.get("/", auth, permit(["admin", "tester"]), userController.getUsers);

// Get user by id (admin only)
router.get("/:id", auth, permit(["admin"]), userController.getUserById);

module.exports = router;

