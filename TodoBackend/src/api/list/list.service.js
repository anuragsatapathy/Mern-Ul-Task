const { List } = require("../../models/listModel");
const { Task } = require("../../models/taskModel");

const createList = async (data) => {
  try {
    const list = new List(data);
    await list.save();
    return {
      status: 200,
      message: "List created successfully!",
      data: list,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getLists = async () => {
  try {
    const lists = await List.find().sort({ createdAt: -1 });
    return { status: 200, data: lists };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getListById = async (id) => {
  try {
    const list = await List.findById(id);
    if (!list) return { status: 404, message: "List not found", data: null };

    const tasks = await Task.find({ listId: id }).sort({ createdAt: -1 });
    return { status: 200, data: { ...list.toObject(), tasks } };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const updateList = async (id, updateData) => {
  try {
    const list = await List.findByIdAndUpdate(id, updateData, { new: true });
    if (!list) return { status: 404, message: "List not found", data: null };
    return { status: 200, message: "List updated successfully", data: list };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const deleteList = async (id) => {
  try {
    const list = await List.findByIdAndDelete(id);
    if (!list) return { status: 404, message: "List not found", data: null };

    // Delete all tasks under this list
    await Task.deleteMany({ listId: id });

    return { status: 200, message: "List and associated tasks deleted", data: list };
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

