const express = require("express");
const router = express.Router();
const controller = require("./task.controller");
const jwtValidation = require("../../middlewares/jwtValidation");

router.post("/", jwtValidation, controller.createTask);
router.get("/", jwtValidation, controller.getTasks);
router.get("/:id", jwtValidation, controller.getTaskById);
router.put("/:id", jwtValidation, controller.updateTask);
router.delete("/:id", jwtValidation, controller.deleteTask);

module.exports = router;
