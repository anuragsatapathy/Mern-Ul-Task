const express = require("express");
const router = express.Router();

// Auth
router.use("/auth", require("./auth/auth.router"));

// Core modules
router.use("/workspaces", require("./workspace/workspace.router"));
router.use("/projects", require("./project/project.router"));
router.use("/tasks", require("./task/task.router"));

// API-level modules
router.use(
  "/workspace-members",
  require("./workspacemember/workspacemember.router")
);

router.use(
  "/analytics",
  require("./analytics/analytics.router")
);

router.use(
  "/activities",
  require("./activity/activity.router")
);

module.exports = router;
