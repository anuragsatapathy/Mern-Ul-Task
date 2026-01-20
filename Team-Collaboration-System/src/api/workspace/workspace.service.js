const prisma = require("../../config/db");

const createWorkspace = async (data, ownerId) => {
  const workspace = await prisma.workspace.create({
    data: { ...data, ownerId },
  });
  return { data: workspace };
};

const getWorkspaces = async (ownerId) => {
  const workspaces = await prisma.workspace.findMany({
    where: { ownerId },
  });
  return { data: workspaces };
};

const getWorkspaceById = async (id) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id },
  });
  return { data: workspace };
};

const updateWorkspace = async (id, data) => {
  const workspace = await prisma.workspace.update({
    where: { id },
    data,
  });
  return { data: workspace };
};

const deleteWorkspace = async (id) => {
  const workspace = await prisma.workspace.delete({
    where: { id },
  });
  return { data: workspace };
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
};
