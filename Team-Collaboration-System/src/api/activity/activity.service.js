const prisma = require("../../config/db");

const logActivity = async (userId, action) => {
  await prisma.activity.create({
    data: { userId, action },
  });
};

const getActivities = async (userId) => {
  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return { status: 200, data: activities };
};

module.exports = {
  logActivity,
  getActivities,
};
