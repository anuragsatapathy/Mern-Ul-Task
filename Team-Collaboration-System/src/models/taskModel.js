const prisma = require("../config/db");

const createTask = (data) => {
  return prisma.task.create({
    data,
  });
};

const getTasks = (filters) => {
  return prisma.task.findMany({
    where: {
      isDeleted: false,
      projectId: filters.projectId,
      status: filters.status,
      assignedTo: filters.assignedTo,
    },
  });
};

const softDeleteTask = (id) => {
  return prisma.task.update({
    where: { id },
    data: { isDeleted: true },
  });
};

module.exports = {
  createTask,
  getTasks,
  softDeleteTask,
};
