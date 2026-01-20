const prisma = require("../../config/db");

const createTask = async (data) => {
  const task = await prisma.task.create({
    data,
  });
  return { data: task };
};

const getTasks = async () => {
  const tasks = await prisma.task.findMany({
    where: { isDeleted: false },
  });
  return { data: tasks };
};

const getTaskById = async (id) => {
  const task = await prisma.task.findFirst({
    where: { id, isDeleted: false },
  });
  return { data: task };
};

const updateTask = async (id, data) => {
  const task = await prisma.task.update({
    where: { id },
    data,
  });
  return { data: task };
};

const deleteTask = async (id) => {
  const task = await prisma.task.update({
    where: { id },
    data: { isDeleted: true },
  });
  return { data: task };
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
