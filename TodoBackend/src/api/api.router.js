const express = require("express");
const router = express.Router();

const listRouter = require("./list/list.router");
const taskRouter = require("./task/task.router");

router.use("/lists", listRouter);
router.use("/tasks", taskRouter);

module.exports = router;


