const express = require("express");
const router = express.Router();
const taskController = require("./task.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, taskController.createTask);
router.get("/", jwtValidation, taskController.getTasks);
router.get("/:id", jwtValidation, taskController.getTaskById);
router.put("/:id", jwtValidation, taskController.updateTask);
router.delete("/:id", jwtValidation, taskController.deleteTask);

module.exports = router;
