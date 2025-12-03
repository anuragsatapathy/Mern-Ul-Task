const listService = require("./list.service");
const responses = require("../../utility/response");

// Create List
const createList = async (req, res) => {
  try {
    const result = await listService.createList(req.body);
    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Get All Lists
const getLists = async (req, res) => {
  try {
    const result = await listService.getLists();
    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Get List By ID
const getListById = async (req, res) => {
  try {
    const result = await listService.getListById(req.params.id);
    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// Update List
const updateList = async (req, res) => {
  try {
    const result = await listService.updateList(req.params.id, req.body);
    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

// SOFT DELETE List
const deleteList = async (req, res) => {
  try {
    const result = await listService.deleteList(req.params.id);
    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createList,
  getLists,
  getListById,
  updateList,
  deleteList,
};
