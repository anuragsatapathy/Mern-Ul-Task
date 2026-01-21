const prisma = require("../config/db");

const addMember = (data) => {
  return prisma.workspaceMember.create({
    data,
  });
};

const getMember = (workspaceId, userId) => {
  return prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
  });
};

const updateRole = (workspaceId, userId, role) => {
  return prisma.workspaceMember.update({
    where: {
      userId_workspaceId: { userId, workspaceId },
    },
    data: { role },
  });
};

const removeMember = (workspaceId, userId) => {
  return prisma.workspaceMember.delete({
    where: {
      userId_workspaceId: { userId, workspaceId },
    },
  });
};

module.exports = {
  addMember,
  getMember,
  updateRole,
  removeMember,
};
