const Goal = require("../../models/goalModel");

// helper to compute progress + status safely
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
    console.error("MONGO CREATE ERROR ", err.message);

    return {
      status: 500,
      message: err.message,
      data: null,
    };
  }
};

// GET ALL GOALS
const getGoals = async () => {
  try {
    const goals = await Goal.find({ isDeleted: false });

    return {
      status: 200,
      message: "Goals fetched",
      data: goals,
    };
  } catch (err) {
    return {
      status: 500,
      message: err.message,
      data: null,
    };
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

    const newTitle =
      data.title !== undefined ? data.title : existing.title;
    const newDescription =
      data.description !== undefined ? data.description : existing.description;
    const newTarget =
      data.targetValue !== undefined ? data.targetValue : existing.targetValue;
    const newCurrent =
      data.currentValue !== undefined
        ? data.currentValue
        : existing.currentValue;

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

    return {
      status: 200,
      message: "Goal updated",
      data: existing,
    };
  } catch (err) {
    console.error("MONGO UPDATE ERROR", err.message);
    return { status: 500, message: err.message, data: null };
  }
};

// DELETE GOAL (SOFT DELETE)
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
