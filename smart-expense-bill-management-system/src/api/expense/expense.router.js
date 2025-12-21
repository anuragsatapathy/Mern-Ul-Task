const express = require("express");
const router = express.Router();

const expenseController = require("./expense.controller");
const upload = require("../../middlewires/upload");
const auth = require("../../middlewires/auth");

// Create (with bill upload)
router.post(
  "/",
  auth,
  upload.single("bill"),
  expenseController.createExpense
);

// Get 
router.get(
  "/",
  auth,
  expenseController.getExpenses
);

// Update 
router.put(
  "/:id",
  auth,
  expenseController.updateExpense
);

// Delete 
router.delete(
"/:id",
  auth,
  expenseController.deleteExpense
);

module.exports = router;


