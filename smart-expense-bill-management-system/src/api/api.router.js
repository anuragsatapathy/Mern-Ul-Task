const express = require("express");
const router = express.Router();

router.use("/users", require("./user/user.router"));
router.use("/expenses", require("./expense/expense.router"));
router.use("/budget", require("./budget/budget.router"));

module.exports = router;
