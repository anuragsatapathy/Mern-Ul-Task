const service = require("./workspace.service");
const responses = require("../../utility/response");

const createWorkspace = async (req, res) => {
  try {
    const result = await service.createWorkspace(req.body, req.user.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const result = await service.getWorkspaces(req.user.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getWorkspaceById = async (req, res) => {
  try {
    const result = await service.getWorkspaceById(req.params.id, req.user.id);
    if (!result.data) return responses.notFoundResponse(res, "Workspace not found");
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const result = await service.updateWorkspace(req.params.id, req.body);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const result = await service.deleteWorkspace(req.params.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
