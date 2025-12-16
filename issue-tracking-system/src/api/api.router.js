const express = require("express");
const router = express.Router();

// Debug log
console.log("API Router: Loaded");

// Import routes
const authRouter = require("./auth/auth.router");
const userRouter = require("./users/user.router");
const issueRouter = require("./issues/issue.router");

// Mount routers
router.use("/auth", authRouter);     // ==> /api/auth
router.use("/users", userRouter);    // ==> /api/users
router.use("/issues", issueRouter);  // ==> /api/issues

module.exports = router;

