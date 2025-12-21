const sendEmail = async (to, subject, body) => {
  console.log("Email sent to:", to);
  return true;
};

module.exports = { sendEmail };
