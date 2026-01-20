const prisma = require("../../config/db");

const createProject = async (data, userId) => {
  const project = await prisma.project.create({
    data: { ...data, createdById: userId },
  });
  return { data: project };
};

const getProjects = async () => {
  const projects = await prisma.project.findMany({
    where: { isDeleted: false },
  });
  return { data: projects };
};

const getProjectById = async (id) => {
  const project = await prisma.project.findUnique({
    where: { id },
  });
  return { data: project };
};

const updateProject = async (id, data) => {
  const project = await prisma.project.update({
    where: { id },
    data,
  });
  return { data: project };
};

const deleteProject = async (id) => {
  const project = await prisma.project.update({
    where: { id },
    data: { isDeleted: true },
  });
  return { data: project };
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
