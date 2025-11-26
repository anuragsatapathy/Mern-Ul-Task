const { success, error } = require('../../utility/responses');
const listService = require('./list.service');
const taskService = require('../task/task.service');

const createList = async (req, res) => {
  try {
    const created = await listService.createList(req.body);
    return success(res, 'List created', created, 201);
  } catch (err) { return error(res, err.message); }
};

const getLists = async (req, res) => {
  try {
    const lists = await listService.getAllLists();
    return success(res, 'Lists fetched', lists);
  } catch (err) { return error(res, err.message); }
};

const getList = async (req, res) => {
  try {
    const list = await listService.getListById(req.params.id);
    if (!list) return error(res, 'List not found', 404);
    return success(res, 'List fetched', list);
  } catch (err) { return error(res, err.message); }
};

const updateList = async (req, res) => {
  try {
    const updated = await listService.updateList(req.params.id, req.body);
    return success(res, 'List updated', updated);
  } catch (err) { return error(res, err.message); }
};

const deleteList = async (req, res) => {
  try {
    await taskService.deleteTasksByListId(req.params.id);
    const deleted = await listService.deleteList(req.params.id);
    return success(res, 'List and tasks deleted', deleted);
  } catch (err) { return error(res, err.message); }
};

module.exports = { createList, getLists, getList, updateList, deleteList };
