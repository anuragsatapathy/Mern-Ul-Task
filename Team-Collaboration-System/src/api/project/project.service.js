const prisma = require("../../config/db");

const createProject = async (data, userId) => {
  try {
    const project = await prisma.project.create({
      data: { ...data, createdById: userId },
    });
    return { status: 200, data: project };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getProjects = async (workspaceId) => {
  try {
    const projects = await prisma.project.findMany({
      where: { workspaceId, isDeleted: false },
    });
    return { status: 200, data: projects };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getProjectById = async (id) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id, isDeleted: false },
    });
    return { status: 200, data: project };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const updateProject = async (id, data) => {
  try {
    const project = await prisma.project.update({
      where: { id },
      data,
    });
    return { status: 200, data: project };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const deleteProject = async (id) => {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { status: 200, data: project };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
