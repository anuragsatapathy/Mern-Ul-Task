const sendEmail = ({ to, subject, body }) => {
  console.log(`[Email] to=${to} subject=${subject}`);
  return Promise.resolve({ ok: true });
};

module.exports = { sendEmail };
