const express = require("express");
const router = express.Router();

const budgetController = require("./budget.controller");
const auth = require("../../middlewires/auth");

router.post("/", auth, budgetController.setBudget);
router.get("/", auth, budgetController.getBudget);

module.exports = router;

