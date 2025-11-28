const List = require('./list.model');

const createList = async (payload) => {
  const list = new List(payload);
  return await list.save();
};

const getAllLists = async () => {
  return await List.find().sort({ createdAt: -1 });
};

const getListById = async (id) => {
  return await List.findById(id);
};

const updateList = async (id, payload) => {
  return await List.findByIdAndUpdate(id, payload, { new: true });
};

const deleteList = async (id) => {
  return await List.findByIdAndDelete(id);
};

module.exports = { createList, getAllLists, getListById, updateList, deleteList };

