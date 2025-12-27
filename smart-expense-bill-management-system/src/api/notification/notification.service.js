const Notification = require("../../models/notificationModel");

// create notification 
const createNotification = async ({ userId, title, message }) => {
  const exists = await Notification.findOne({
    userId,
    title,
    message,
    isRead: false,
  });


  if (exists) return;

  return Notification.create({
    userId,
    title,
    message,
    isRead: false,
  });
};

const getNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 });
};

const markAllRead = async (userId) => {
  return Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
};

module.exports = {
  createNotification,
  getNotifications,
  markAllRead,
};
