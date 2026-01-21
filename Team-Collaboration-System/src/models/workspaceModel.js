const prisma = require("../config/db");

const createWorkspace = (data) => {
  return prisma.workspace.create({
    data,
  });
};

const getUserWorkspaces = (userId) => {
  return prisma.workspace.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
  });
};

const getWorkspaceById = (id, userId) => {
  return prisma.workspace.findFirst({
    where: {
      id,
      members: {
        some: { userId },
      },
    },
  });
};

module.exports = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
};
