const issueService = require("./issue.service");
const responses = require("../../utility/response");

// Create issue (admin/tester)
const createIssue = async (req, res) => {
  try {
    const payload = { ...req.body, createdBy: req.user && req.user.id };
    const result = await issueService.createIssue(payload);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data, "Issue created successfully");
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

// Get issues (list)
const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const q = req.query.q || null;
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      assignedTo: req.query.assignedTo,
      createdBy: req.query.createdBy,
      dueFrom: req.query.dueFrom,
      dueTo: req.query.dueTo,
    };
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "desc";

    const result = await issueService.getIssues({ page, limit, q, filters, user: req.user, sortBy, order });
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.paginatedResponse(res, result.data.items, result.data.total, result.data.offset);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const getIssueById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await issueService.getIssueById(id, req.user);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const updateIssue = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const result = await issueService.updateIssue(id, payload, req.user);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data, "Issue updated successfully");
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const deleteIssue = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await issueService.deleteIssue(id);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data, "Issue deleted");
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const assignIssue = async (req, res) => {
  try {
    const id = req.params.id;
    const { assignedTo } = req.body;
    const result = await issueService.assignIssue(id, assignedTo);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data, "Issue assigned");
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

// Analytics controllers
const statusCount = async (req, res) => {
  try {
    const result = await issueService.analyticsStatusCount();
    if (result.status && result.status !== 200) return responses.generateResponse(res, false, result.message, result.status);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const priorityCount = async (req, res) => {
  try {
    const result = await issueService.analyticsPriorityCount();
    if (result.status && result.status !== 200) return responses.generateResponse(res, false, result.message, result.status);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

const overdue = async (req, res) => {
  try {
    const result = await issueService.analyticsOverdue();
    if (result.status && result.status !== 200) return responses.generateResponse(res, false, result.message, result.status);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  assignIssue,
  statusCount,
  priorityCount,
  overdue,
};
