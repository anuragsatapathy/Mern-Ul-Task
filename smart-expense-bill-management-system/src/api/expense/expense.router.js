const express = require("express");
const router = express.Router();

const expenseController = require("./expense.controller");
const upload = require("../../middlewires/upload");
const auth = require("../../middlewires/auth");

// Create Expense (with bill upload)
router.post(
  "/",
  auth,
  upload.single("bill"),
  expenseController.createExpense
);

router.get("/", auth, expenseController.getExpenses);
router.put("/:id", auth, expenseController.updateExpense);
router.delete("/:id", auth, expenseController.deleteExpense);

module.exports = router;


