const express = require("express");
const router = express.Router();
const TaskController = require("./task.controller");

// Routes
router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTask);
router.post("/", TaskController.addTask);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);
router.patch("/:id/complete", TaskController.completeTask);

module.exports = router;
