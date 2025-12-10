const express = require("express");
const router = express.Router();

const goalController = require("./goal.controller");
const {
  createGoalSchema,
  updateGoalSchema,
  validate,
} = require("../../middlewares/goal.validation");

// ✅ CREATE goal with validation
router.post("/", validate(createGoalSchema), goalController.createGoal);

// ✅ GET all goals
router.get("/", goalController.getGoals);

// ✅ GET single goal by ID
router.get("/:id", goalController.getGoalById);

// ✅ UPDATE goal with validation
router.put("/:id", validate(updateGoalSchema), goalController.updateGoal);

// ✅ DELETE goal
router.delete("/:id", goalController.deleteGoal);

module.exports = router;
