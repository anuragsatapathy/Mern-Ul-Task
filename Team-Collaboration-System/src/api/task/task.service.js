const prisma = require("../../config/db");

const createTask = async (data) => {
  try {
    const task = await prisma.task.create({ data });
    return { status: 200, data: task };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getTasks = async (filters) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        isDeleted: false,
        status: filters.status,
        assignedTo: filters.assignedTo,
        projectId: filters.projectId,
      },
    });
    return { status: 200, data: tasks };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getTaskById = async (id) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id, isDeleted: false },
    });
    return { status: 200, data: task };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const updateTask = async (id, data) => {
  try {
    const task = await prisma.task.update({
      where: { id },
      data,
    });
    return { status: 200, data: task };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const deleteTask = async (id) => {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });
    return { status: 200, data: task };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
