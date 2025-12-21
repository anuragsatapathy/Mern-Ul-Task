const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

// Create User
router.post("/", userController.createUser);

// Get All Users
router.get("/", userController.getUsers);

// Get User by ID
router.get("/:id", userController.getUserById);

// Update User
router.put("/:id", userController.updateUser);

// Delete User
router.delete("/:id", userController.deleteUser);

module.exports = router;
