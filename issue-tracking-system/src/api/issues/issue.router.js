const express = require("express");
const router = express.Router();
const issueController = require("./issue.controller");
const auth = require("../../middlewares/auth");
const { permit } = require("../../middlewares/roles");
const validation = require("../../middlewares/validation");

// Create issue - only admin & tester
router.post("/", auth, permit(["admin", "tester"]), validation.validateCreateIssue, issueController.createIssue);

// List issues - auth required 
router.get("/", auth, issueController.getIssues);

// Get single issue
router.get("/:id", auth, issueController.getIssueById);

// Update issue - developers can only update status; service enforces it
router.put("/:id", auth, validation.validateUpdateIssue, issueController.updateIssue);

// Delete issue - admin only
router.delete("/:id", auth, permit(["admin"]), issueController.deleteIssue);

// Assign issue - admin/tester
router.patch("/:id/assign", auth, permit(["admin", "tester"]), issueController.assignIssue);

// Analytics
router.get("/analytics/status-count", auth, permit(["admin", "tester"]), issueController.statusCount);
router.get("/analytics/priority-count", auth, permit(["admin", "tester"]), issueController.priorityCount);
router.get("/analytics/overdue", auth, permit(["admin", "tester"]), issueController.overdue);

module.exports = router;
