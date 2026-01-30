const prisma = require("../../config/db");

const createWorkspace = async (data, userId) => {
  try {
    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        description: data.description || null,
        isDeleted: false,

        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
    });

    return { status: 200, data: workspace };
  } catch (err) {
    throw err;
  }
};

const getWorkspaces = async (userId) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        isDeleted: false,
        members: {
          some: { userId }, 
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = workspaces.map((w) => {
      const myMember = w.members.find(
        (m) => m.userId === userId
      );

      const ownerMember = w.members.find(
        (m) => m.role === "OWNER"
      );

      return {
        id: w.id,
        name: w.name,
        description: w.description,
        createdAt: w.createdAt,
        myRole: myMember?.role.toLowerCase(),
        owner: ownerMember
          ? {
              id: ownerMember.user.id,
              name: ownerMember.user.name,
              email: ownerMember.user.email,
            }
          : null,
        members: w.members.map((m) => ({
          id: m.id,
          role: m.role,
          user: {
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
          },
        })),
      };
    });

    return { status: 200, data: formatted };
  } catch (err) {
    throw err;
  }
};

const updateWorkspace = async (id, data) => {
  const result = await prisma.workspace.updateMany({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  });

  if (!result.count) {
    return { status: 404, message: "Workspace not found" };
  }

  return { status: 200, data: result };
};

const deleteWorkspace = async (id) => {
  const result = await prisma.workspace.updateMany({
    where: {
      id,
      isDeleted: false,
    },
    data: { isDeleted: true },
  });

  if (!result.count) {
    return { status: 404, message: "Workspace not found" };
  }

  return { status: 200, data: result };
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
};
