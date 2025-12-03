const { List } = require("../../models/listModel");
const { Task } = require("../../models/taskModel");

// Create List
const createList = async (data) => {
  try {
    const list = new List(data);
    await list.save();
    return { status: 200, message: "List created successfully", data: list };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

// Get All Lists (only active)
const getLists = async () => {
  try {
    const lists = await List.find({ isDeleted: false }).sort({ createdAt: -1 });
    return { status: 200, data: lists || [] };
  } catch (error) {
    return { status: 500, message: error.message, data: [] };
  }
};

// Get List By ID
const getListById = async (id) => {
  try {
    const list = await List.findById(id);
    if (!list || list.isDeleted)
      return { status: 404, message: "List not found", data: null };

    const tasks = await Task.find({ listId: id, isDeleted: false }).sort({ createdAt: -1 });

    return {
      status: 200,
      data: { ...list.toObject(), tasks: tasks || [] }
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

// Update List
const updateList = async (id, updateData) => {
  try {
    const list = await List.findByIdAndUpdate(id, updateData, { new: true });
    if (!list) return { status: 404, message: "List not found", data: null };

    return { status: 200, message: "List updated successfully", data: list };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

// SOFT DELETE List + Tasks
const deleteList = async (id) => {
  try {
    const list = await List.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!list)
      return { status: 404, message: "List not found", data: null };

    // soft delete all tasks under this list
    await Task.updateMany(
      { listId: id },
      { isDeleted: true }
    );

    return {
      status: 200,
      message: "List and tasks soft deleted",
      data: list,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = {
  createList,
  getLists,
  getListById,
  updateList,
  deleteList,
};


