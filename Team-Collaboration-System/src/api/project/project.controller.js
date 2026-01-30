const service = require("./project.service");
const responses = require("../../utility/response");

const createProject = async (req, res) => {
  try {
    const result = await service.createProject(req.body, req.user.id);
    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getProjects = async (req, res) => {
  try {
    const result = await service.getProjects(
      req.query.workspaceId,
      req.user.id
    );

    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getProjectById = async (req, res) => {
  try {
    const result = await service.getProjectById(
      req.params.id,
      req.user.id
    );

    if (result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateProject = async (req, res) => {
  try {
    const result = await service.updateProject(
      req.params.id,
      req.body,
      req.user.id
    );

    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const deleteProject = async (req, res) => {
  try {
    const result = await service.deleteProject(req.params.id, req.user.id);

    if (result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById, 
  updateProject,
  deleteProject,
};
