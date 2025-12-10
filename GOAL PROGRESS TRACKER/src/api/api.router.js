const express = require("express");
const router = express.Router();

//const listRouter = require("./list/list.router");
//const taskRouter = require("./task/task.router");

const goalRouter = require("./goal/goal.router");

//router.use("/list", listRouter);
//router.use("/task", taskRouter);

router.use("/goal", goalRouter);

module.exports = router;

