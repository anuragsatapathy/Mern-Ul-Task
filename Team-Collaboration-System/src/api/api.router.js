const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/auth.router"));
router.use("/workspaces", require("./workspace/workspace.router"));
router.use("/projects", require("./project/project.router"));
router.use("/tasks", require("./task/task.router"));

module.exports = router;
