const Goal = require("../../models/goalModel");

// Helper to compute progress
const computeProgressAndStatus = (currentValue, targetValue) => {
  const target = Number(targetValue) || 0;
  const current = Number(currentValue) || 0;

  const progress = target > 0 ? (current / target) * 100 : 0;
  const status = target > 0 && current >= target ? "completed" : "ongoing";

  return { progress, status, current, target };
};

// CREATE GOAL
const createGoal = async (data) => {
  try {
    const { title, description, targetValue, currentValue } = data;

    const { progress, status, current, target } = computeProgressAndStatus(
      currentValue ?? 0,
      targetValue
    );

    const goal = new Goal({
      title,
      description: description || "",
      targetValue: target,
      currentValue: current,
      progress,
      status,
    });

    await goal.save();

    return {
      status: 200,
      message: "Goal created successfully",
      data: goal,
    };
  } catch (err) {
    return { status: 500, message: err.message, data: null };
  }
};

// UPDATED: GET GOALS WITH PAGINATION + SOFT DELETE
const getGoals = async (page = 1, limit = 5) => {
  try {
    const skip = (page - 1) * limit;

    const totalGoals = await Goal.countDocuments({ isDeleted: false });

    const goals = await Goal.find({ isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalGoals / limit);

    return {
      status: 200,
      message: "Goals fetched",
      data: {
        goals,
        totalGoals,
        totalPages,
        page,
        limit,
      },
    };
  } catch (err) {
    return { status: 500, message: err.message, data: null };
  }
};

// GET GOAL BY ID
const getGoalById = async (id) => {
  try {
    const goal = await Goal.findOne({ _id: id, isDeleted: false });

    if (!goal)
      return { status: 404, message: "Goal not found", data: null };

    return { status: 200, message: "Goal fetched", data: goal };
  } catch (err) {
    return { status: 500, message: err.message, data: null };
  }
};

// UPDATE GOAL
const updateGoal = async (id, data) => {
  try {
    const existing = await Goal.findOne({ _id: id, isDeleted: false });

    if (!existing)
      return { status: 404, message: "Goal not found", data: null };

    const newTitle = data.title ?? existing.title;
    const newDescription = data.description ?? existing.description;
    const newTarget = data.targetValue ?? existing.targetValue;
    const newCurrent = data.currentValue ?? existing.currentValue;

    const { progress, status, current, target } = computeProgressAndStatus(
      newCurrent,
      newTarget
    );

    existing.title = newTitle;
    existing.description = newDescription;
    existing.targetValue = target;
    existing.currentValue = current;
    existing.progress = progress;
    existing.status = status;

    await existing.save();

    return { status: 200, message: "Goal updated", data: existing };
  } catch (err) {
    return { status: 500, message: err.message, data: null };
  }
};

// SOFT DELETE
const deleteGoal = async (id) => {
  try {
    const goal = await Goal.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!goal)
      return { status: 404, message: "Goal not found", data: null };

    return { status: 200, message: "Goal deleted", data: goal };
  } catch (err) {
    return { status: 500, message: err.message, data: null };
  }
};

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
