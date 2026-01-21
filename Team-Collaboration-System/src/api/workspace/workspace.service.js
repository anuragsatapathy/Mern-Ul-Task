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
    const workspace = await prisma.workspace.update({
      where: { id },
      data,
    });
    return { status: 200, data: workspace };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const deleteWorkspace = async (id) => {
  try {
    const workspace = await prisma.workspace.delete({
      where: { id },
    });
    return { status: 200, data: workspace };
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
