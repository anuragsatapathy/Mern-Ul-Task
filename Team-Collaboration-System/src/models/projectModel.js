const prisma = require("../config/db");

const createProject = (data) => {
  return prisma.project.create({
    data,
  });
};

const getProjects = (filters) => {
  return prisma.project.findMany({
    where: {
      workspaceId: filters.workspaceId,
      isDeleted: false,
      name: filters.search
        ? { contains: filters.search, mode: "insensitive" }
        : undefined,
    },
    skip: Number(filters.offset || 0),
    take: Number(filters.limit || 10),
  });
};

const softDeleteProject = (id) => {
  return prisma.project.update({
    where: { id },
    data: { isDeleted: true },
  });
};

module.exports = {
  createProject,
  getProjects,
  softDeleteProject,
};
