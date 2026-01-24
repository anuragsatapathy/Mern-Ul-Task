const prisma = require("../../config/db");

const createTask = async (data, userId) => {
  try {
    if (!data.title || !data.projectId) {
      return { status: 400, message: "Title and projectId are required" };
    }

    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        isDeleted: false,
      },
    });

    if (!project) {
      return { status: 400, message: "Invalid projectId" };
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        projectId: data.projectId,
        assignedTo: userId,
      },
    });

    return { status: 200, data: task };
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    return { status: 500, message: "Task not created" };
  }
};

const getTasks = async (filters) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        isDeleted: false,
        projectId: filters.projectId,
      },
      orderBy: { createdAt: "desc" },
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
