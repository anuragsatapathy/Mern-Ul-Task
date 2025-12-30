const PDFDocument = require("pdfkit");
const Profile = require("../../models/profileModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Skill = require("../../models/skillModel");

const generateCV = async (userId, res) => {
  const profile = await Profile.findOne({ userId });
  const education = await Education.find({ userId, isDeleted: false });
  const experience = await Experience.find({ userId, isDeleted: false });
  const skills = await Skill.find({ userId, isDeleted: false });

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=cv.pdf");

  doc.pipe(res);

  doc.fontSize(18).text(profile?.fullName || "CV", { underline: true });
  doc.moveDown();
  doc.text(profile?.summary || "");

  doc.moveDown().text("Education");
  education.forEach((e) => doc.text(`${e.degree} - ${e.institution}`));

  doc.moveDown().text("Experience");
  experience.forEach((e) => doc.text(`${e.role} at ${e.company}`));

  doc.moveDown().text("Skills");
  skills.forEach((s) => doc.text(`${s.name} - ${s.level}`));

  doc.end();
};

module.exports = { generateCV };
