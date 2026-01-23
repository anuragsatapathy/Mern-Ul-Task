const prisma = require("../../config/db");

const createWorkspace = async (data, userId) => {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        ...data,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
    });
    return { status: 200, data: workspace };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getWorkspaces = async (userId) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        isDeleted: false,
        members: {
          some: { userId },
        },
      },
    });
    return { status: 200, data: workspaces };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getWorkspaceById = async (id, userId) => {
  try {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id,
        isDeleted: false,
        members: {
          some: { userId },
        },
      },
    });
    return { status: 200, data: workspace };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const updateWorkspace = async (id, data) => {
  try {
    const result = await prisma.workspace.updateMany({
      where: {
        id,
        isDeleted: false,
      },
      data,
    });

    if (result.count === 0) {
      return { status: 404, message: "Workspace not found" };
    }

    return { status: 200, data: result };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const deleteWorkspace = async (id) => {
  try {
    const result = await prisma.workspace.updateMany({
      where: {
        id,
        isDeleted: false,
      },
      data: { isDeleted: true },
    });

    if (result.count === 0) {
      return { status: 404, message: "Workspace not found" };
    }

    return { status: 200, data: result };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
