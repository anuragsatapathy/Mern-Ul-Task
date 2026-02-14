const prisma = require("../../config/db");
const activityService = require("../activity/activity.service"); // ⭐ ADDED

const hasWriteAccess = async (projectId, userId) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!project) return false;

  const member = project.workspace.members.find(
    (m) => m.userId === userId
  );

  if (!member) return false;

  return ["OWNER", "ADMIN"].includes(member.role);
};

const createProject = async (data, userId) => {
  try {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: data.workspaceId,
        userId,
      },
    });

    if (!member || !["OWNER", "ADMIN"].includes(member.role)) {
      return { status: 403, message: "Permission denied" };
    }

    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        status: "active",
        workspaceId: data.workspaceId,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    /* ⭐ ACTIVITY LOG */
    await activityService.logActivity({
      userId,
      type: "PROJECT_CREATED",
      message: `Created project "${project.name}"`,
      entityId: project.id,
    });

    return { status: 200, data: project };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getProjects = async (workspaceId, userId) => {
  try {
    const member = await prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });

    if (!member) {
      return { status: 403, message: "Not a workspace member" };
    }

    const projects = await prisma.project.findMany({
      where: {
        workspaceId,
        isDeleted: false,
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { status: 200, data: projects };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const getProjectById = async (projectId, userId) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
        workspace: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!project || project.isDeleted) {
      return { status: 404, message: "Project not found" };
    }

    const isMember = project.workspace.members.some(
      (m) => m.userId === userId
    );

    if (!isMember) {
      return { status: 403, message: "Access denied" };
    }

    return { status: 200, data: project };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const updateProject = async (projectId, data, userId) => {
  try {
    const allowed = await hasWriteAccess(projectId, userId);
    if (!allowed) {
      return { status: 403, message: "Permission denied" };
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
      },
    });

    /* ⭐ ACTIVITY LOG */
    await activityService.logActivity({
      userId,
      type: "PROJECT_UPDATED",
      message: `Updated project "${project.name}"`,
      entityId: project.id,
    });

    return { status: 200, data: project };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const deleteProject = async (projectId, userId) => {
  try {
    const allowed = await hasWriteAccess(projectId, userId);
    if (!allowed) {
      return { status: 403, message: "Permission denied" };
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { isDeleted: true },
    });

    /* ⭐ ACTIVITY LOG */
    await activityService.logActivity({
      userId,
      type: "PROJECT_DELETED",
      message: `Deleted project "${project.name}"`,
      entityId: project.id,
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
