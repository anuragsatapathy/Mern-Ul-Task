const express = require("express");
const router = express.Router();

const taskController = require("./task.controller");
const { validateTask } = require("../../middlewares/validation");

// Create Task
router.post("/:id", validateTask, taskController.createTask);

// Get All Tasks
router.get("/", taskController.getTasks);

// Get Task by ID
router.get("/:id", taskController.getTaskById);

// Update Task (includes completion tick)
router.put("/:id", taskController.updateTask);

// Soft Delete Task
router.delete("/:id", taskController.deleteTask);

module.exports = router;




