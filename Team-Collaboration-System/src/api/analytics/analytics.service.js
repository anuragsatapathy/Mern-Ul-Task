const prisma = require("../../config/db");

const dashboard = async (workspaceId) => {
  try {
    // Tasks per status
    const tasksByStatus = await prisma.task.groupBy({
      by: ["status"],
      where: {
        isDeleted: false,
        project: {
          workspaceId,
        },
      },
      _count: true,
    });

    // Tasks per user
    const tasksPerUser = await prisma.task.groupBy({
      by: ["assignedTo"],
      where: {
        isDeleted: false,
        project: {
          workspaceId,
        },
      },
      _count: true,
    });


    const overdueTasks = await prisma.task.count({
      where: {
        isDeleted: false,
        project: {
          workspaceId,
        },
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
      },
    });

    // Projects per workspace
    const projectsCount = await prisma.project.count({
      where: {
        workspaceId,
        isDeleted: false,
      },
    });

    return {
      status: 200,
      data: {
        tasksByStatus,
        tasksPerUser,
        overdueTasks,
        projectsCount,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message,
      data: null,
    };
  }
};

module.exports = {
  dashboard,
};
