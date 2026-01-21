const prisma = require("../config/db");

const logActivity = (userId, action) => {
  return prisma.activity.create({
    data: { userId, action },
  });
};

const getUserActivities = (userId) => {
  return prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  logActivity,
  getUserActivities,
};
