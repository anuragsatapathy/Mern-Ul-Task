const express = require("express");
const router = express.Router();

const taskController = require("./task.controller");
const { validateTask } = require("../../middlewares/validation");

// Create Task
router.post("/", validateTask, taskController.createTask);

// Get All Tasks
router.get("/", taskController.getTasks);

// Get Task by ID
router.get("/:id", taskController.getTaskById);

// Update Task
router.put("/:id", validateTask, taskController.updateTask);

// Delete Task
router.delete("/:id", taskController.deleteTask);

module.exports = router;




