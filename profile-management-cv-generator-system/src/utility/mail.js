const nodemailer = require("nodemailer");
// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const verifySendEmail = async (email,subject,text) => {

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  service: 'gmail', 
  port: 465,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "anurag.satapathy401@gmail.com",
    pass: "wuhshjozcpdusldq",
  },
});

// Send an email using async/await

  const info = await transporter.sendMail({
    from: '"CV-GENERATOR" <anurag.satapathy401@gmail.com>',
    to: email,
    subject ,
    text  // Plain-text version of the message
    //html: "<b>Hello world?</b>", // HTML version of the message
  });


  console.log("Message sent:", info.messageId);
}
  module.exports = {verifySendEmail}