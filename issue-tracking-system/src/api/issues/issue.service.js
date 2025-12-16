const Issue = require("../../models/issue.model");
const User = require("../../models/user.model");
const mongoose = require("mongoose");

const createIssue = async (data) => {
  try {
    if (!data.title || !data.createdBy) {
      return { status: 400, message: "title and createdBy are required", data: null };
    }

    const issue = new Issue({
      title: data.title,
      description: data.description || "",
      priority: data.priority || "medium",
      assignedTo: data.assignedTo || null,
      createdBy: data.createdBy,
      dueDate: data.dueDate || null,
    });

    await issue.save();

    const populated = await Issue.findById(issue._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .lean();

    return { status: 200, message: "Issue created", data: populated };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getIssues = async ({
  page = 1,
  limit = 10,
  q = null,
  filters = {},
  user = null,
  sortBy = "createdAt",
  order = "desc",
}) => {
  try {
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false };

    // 🔒 ROLE-BASED VISIBILITY (FIXED)
    if (user && user.role === "developer") {
      // Developer should see ONLY issues assigned to them
      filter.assignedTo = new mongoose.Types.ObjectId(user.id);
    } else {
      // Admin & Tester – existing behavior (UNCHANGED)
      if (filters.status) filter.status = filters.status;
      if (filters.priority) filter.priority = filters.priority;
      if (filters.assignedTo)
        filter.assignedTo = new mongoose.Types.ObjectId(filters.assignedTo);
      if (filters.createdBy)
        filter.createdBy = new mongoose.Types.ObjectId(filters.createdBy);
      if (filters.dueFrom || filters.dueTo) {
        filter.dueDate = {};
        if (filters.dueFrom) filter.dueDate.$gte = new Date(filters.dueFrom);
        if (filters.dueTo) filter.dueDate.$lte = new Date(filters.dueTo);
      }
    }

    // Search
    if (q) {
      filter.$text = { $search: q };
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    let findQuery = Issue.find(filter)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (filter.$text) {
      findQuery = Issue.find(
        filter,
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit)
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email role");
    } else {
      findQuery = findQuery.sort(sortObj).skip(skip).limit(limit);
    }

    const [items, total] = await Promise.all([
      findQuery.lean(),
      Issue.countDocuments(filter),
    ]);

    return {
      status: 200,
      message: "Issues fetched",
      data: { items, total, offset: skip },
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getIssueById = async (id, user = null) => {
  try {
    const issue = await Issue.findOne({ _id: id, isDeleted: false })
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .lean();

    if (!issue) return { status: 404, message: "Issue not found", data: null };

    if (user && user.role === "developer") {
      if (!issue.assignedTo || issue.assignedTo._id.toString() !== user.id) {
        return { status: 403, message: "Forbidden", data: null };
      }
    }

    return { status: 200, message: "Issue fetched", data: issue };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const updateIssue = async (id, payload, user = null) => {
  try {
    const issue = await Issue.findById(id);
    if (!issue || issue.isDeleted)
      return { status: 404, message: "Issue not found", data: null };

    // Developer: only status update
    if (user && user.role === "developer") {
      if (!issue.assignedTo || issue.assignedTo.toString() !== user.id) {
        return { status: 403, message: "Forbidden", data: null };
      }

      if (!payload.status) {
        return {
          status: 400,
          message: "Developer can only update status",
          data: null,
        };
      }

      issue.status = payload.status;
      await issue.save();

      const populated = await Issue.findById(issue._id)
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email role")
        .lean();

      return { status: 200, message: "Issue updated", data: populated };
    }

    // Admin & Tester (UNCHANGED)
    const allowed = ["title", "description", "status", "priority", "assignedTo", "dueDate"];
    allowed.forEach((f) => {
      if (typeof payload[f] !== "undefined") issue[f] = payload[f];
    });

    await issue.save();

    const populated = await Issue.findById(issue._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .lean();

    return { status: 200, message: "Issue updated", data: populated };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const deleteIssue = async (id) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!issue) return { status: 404, message: "Issue not found", data: null };
    return { status: 200, message: "Issue deleted (soft)", data: issue };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const assignIssue = async (id, assignedToId) => {
  try {
    const user = await User.findOne({ _id: assignedToId, isDeleted: false });
    if (!user) return { status: 404, message: "Assignee not found", data: null };

    const issue = await Issue.findByIdAndUpdate(
      id,
      { assignedTo: assignedToId },
      { new: true }
    )
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .lean();

    if (!issue) return { status: 404, message: "Issue not found", data: null };

    return { status: 200, message: "Issue assigned", data: issue };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  assignIssue,
};
