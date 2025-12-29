const express = require("express");
const router = express.Router();

router.use("/users", require("./user/user.router"));
router.use("/expenses", require("./expense/expense.router"));
router.use("/budget", require("./budget/budget.router")); // 🔴 FIX
router.use("/notifications", require("./notification/notification.router"));
router.use("/files", require("./files/file.router"));
router.use("/analytics", require("./analytics/analytics.router"));

module.exports = router;

