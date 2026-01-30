const service = require("./workspace.service");
const responses = require("../../utility/response");
const prisma = require("../../config/db");

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
    const result = await service.getWorkspaceById(
      req.params.id,
      req.user.id
    );

    if (!result.data) {
      return responses.notFoundResponse(res, "Workspace not found");
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};


const updateWorkspace = async (req, res) => {
  try {
    const result = await service.updateWorkspace(
      req.params.id,
      req.body
    );

    if (result.status !== 200) {
      return responses.notFoundResponse(res, result.message);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};


const deleteWorkspace = async (req, res) => {
  try {
    const result = await service.deleteWorkspace(req.params.id);

    if (result.status !== 200) {
      return responses.notFoundResponse(res, result.message);
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getMembersByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        isDeleted: false,
      },
      select: { workspaceId: true },
    });

    if (!project) {
      return responses.notFoundResponse(res, "Project not found");
    }

    const members = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: project.workspaceId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return responses.successResponse(res, members);
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
  getMembersByProject, 
};
