const prisma = require("../../config/db");

const addMember = async ({ workspaceId, userId, role }) => {
  try {
    const member = await prisma.workspaceMember.create({
      data: { workspaceId, userId, role },
    });

    return { status: 200, data: member };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const updateRole = async ({ workspaceId, userId, role }) => {
  try {
    const member = await prisma.workspaceMember.update({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
      data: { role },
    });

    return { status: 200, data: member };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const removeMember = async ({ workspaceId, userId }) => {
  try {
    const member = await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: { userId, workspaceId },
      },
    });

    return { status: 200, data: member };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = {
  addMember,
  updateRole,
  removeMember,
};
