const projectService = require("./project.service"); const responses = require("../../utility/response");

const createProject = async (req, res) => {
  try {
    const result = await projectService.createProject(req.body, req.user.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getProjects = async (req, res) => {
  try {
    const result = await projectService.getProjects();
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getProjectById = async (req, res) => {
  try {
    const result = await projectService.getProjectById(req.params.id);
    if (!result.data) return responses.notFoundResponse(res, "Project not found");
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateProject = async (req, res) => {
  try {
    const result = await projectService.updateProject(req.params.id, req.body);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const deleteProject = async (req, res) => {
  try {
    const result = await projectService.deleteProject(req.params.id);
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
