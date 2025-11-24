const sendNotification = ({ userId, title, message }) => {
  console.log(`[Notify] user=${userId} title=${title}`);
  return Promise.resolve({ ok: true });
};

module.exports = { sendNotification };
