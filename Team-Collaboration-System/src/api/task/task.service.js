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
      return { status: 404, message: "Project not found" };
    }

    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: project.workspaceId,
        userId,
      },
    });

    if (!member) {
      return { status: 403, message: "Permission denied" };
    }

  
    const statusMap = {
      "todo": "TODO",
      "in-progress": "IN_PROGRESS",
      "done": "DONE",
    };

    const priorityMap = {
      "low": "LOW",
      "medium": "MEDIUM",
      "high": "HIGH",
    };


    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        status: statusMap[data.status] || "TODO",
        priority: priorityMap[data.priority] || "MEDIUM",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,

        projectId: data.projectId,   
        assignedTo: userId,          
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    return { status: 200, data: task };
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    return { status: 500, message: err.message };
  }
};


const getTasks = async (projectId, userId) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workspace: {
          include: { members: true },
        },
      },
    });

    if (!project) {
      return { status: 404, message: "Project not found" };
    }

    const isMember = project.workspace.members.some(
      (m) => m.userId === userId
    );

    if (!isMember) {
      return { status: 403, message: "Access denied" };
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        isDeleted: false,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { status: 200, data: tasks };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};


const updateTask = async (id, data, userId) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        project: {
          include: {
            workspace: {
              include: { members: true },
            },
          },
        },
      },
    });

    if (!task) {
      return { status: 404, message: "Task not found" };
    }

    const isMember = task.project.workspace.members.some(
      (m) => m.userId === userId
    );

    if (!isMember) {
      return { status: 403, message: "Permission denied" };
    }

    const statusMap = {
      "todo": "TODO",
      "in-progress": "IN_PROGRESS",
      "done": "DONE",
    };

    const priorityMap = {
      "low": "LOW",
      "medium": "MEDIUM",
      "high": "HIGH",
    };

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: data.title ?? task.title,
        description: data.description ?? task.description,
        status: statusMap[data.status] || task.status,
        priority: priorityMap[data.priority] || task.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : task.dueDate,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });

    return { status: 200, data: updatedTask };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};


const deleteTask = async (id, userId) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        project: {
          include: {
            workspace: {
              include: { members: true },
            },
          },
        },
      },
    });

    if (!task) {
      return { status: 404, message: "Task not found" };
    }

    const isMember = task.project.workspace.members.some(
      (m) => m.userId === userId
    );

    if (!isMember) {
      return { status: 403, message: "Permission denied" };
    }

    const deletedTask = await prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });

    return { status: 200, data: deletedTask };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
