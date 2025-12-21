const sendNotification = async (userId, message) => {
  console.log("Notification sent to:", userId);
  return true;
};

module.exports = { sendNotification };
