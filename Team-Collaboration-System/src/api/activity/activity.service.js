const prisma = require("../../config/db");

const logActivity = async ({ userId, type, message, entityId = null }) => {
  try {
    await prisma.activity.create({
      data: {
        userId,
        type,
        message,
        entityId,
      },
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};

const getActivities = async (userId) => {
  const activities = await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return { status: 200, data: activities };
};

module.exports = {
  logActivity,
  getActivities,
};
