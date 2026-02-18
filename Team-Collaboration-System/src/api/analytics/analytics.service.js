const prisma = require("../../config/db");

const dashboard = async (workspaceId) => {
  try {
    if (!workspaceId) {
      return { status: 400, message: "workspaceId required" };
    }

    const tasksByStatus = await prisma.task.groupBy({
      by: ["status"],
      where: {
        isDeleted: false,
        project: { workspaceId },
      },
      _count: { _all: true },
    });

    /* ================= TASKS PER USER ================= */
    // const tasksPerUser = await prisma.task.groupBy({
    //   by: ["assignedTo"],
    //   where: {
    //     isDeleted: false,
    //     project: { workspaceId },
    //   },
    //   _count: { _all: true },
    // });

    const tasksPerUser = await prisma.task.groupBy({
      by: ["assignedTo", "status"],
      where: {
        isDeleted: false,
        project: { workspaceId },
      },
      _count: { _all: true },
    });


    
    const overdueTasks = await prisma.task.count({
      where: {
        isDeleted: false,
        project: { workspaceId },
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
      },
    });

    const projectsCount = await prisma.project.count({
      where: {
        workspaceId,
        isDeleted: false,
      },
    });


    const productivityRaw = await prisma.task.groupBy({
      by: ["assignedTo"],
      where: {
        project: { workspaceId },
        status: "DONE",
        isDeleted: false,
      },
      _count: { _all: true },
    });

    /**
     * 
     * groupBy does NOT return user relation
     * So we fetch users separately and attach names
     */
    // const userIds = productivityRaw.map((p) => p.assignedTo);

    // Get all unique user IDs from tasksPerUser
      const userIds = [
        ...new Set(tasksPerUser.map((t) => t.assignedTo))
      ];

      let users = [];

      if (userIds.length > 0) {
        users = await prisma.user.findMany({
          where: {
            id: { in: userIds },
          },
          select: {
            id: true,
            name: true,
          },
        });
      }

      const tasksPerUserWithNames = tasksPerUser.map((t) => {
        const user = users.find((u) => u.id === t.assignedTo);

        return {
          ...t,
          user: user || { name: "Unknown" },
        };
      });



    // const users = await prisma.user.findMany({
    //   where: {
    //     id: { in: userIds },
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //   },
    // });

    const productivity = productivityRaw.map((p) => {
      const user = users.find((u) => u.id === p.assignedTo);
      return {
        ...p,
        user: user || { name: "Unknown" },
      };
    });

    return {
      status: 200,
      data: {
        tasksByStatus,
        tasksPerUser: tasksPerUserWithNames,
        overdueTasks,
        projectsCount,
        productivity,
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
