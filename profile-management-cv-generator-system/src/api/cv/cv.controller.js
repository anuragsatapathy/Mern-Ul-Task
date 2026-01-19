const cvService = require("./cv.service");
const responses = require("../../utility/response");
const User = require("../../models/userModel");
const { verifySendEmail } = require("../../utility/mail");

/* PREVIEW CV */
const previewCV = async (req, res) => {
  try {
    const template = req.query.template || "template1";
    const userId = req.user.id || req.user._id;

    const html = await cvService.buildCVHTML(userId, template);
    return res.send(html);
  } catch (err) {
    console.error("CV PREVIEW ERROR:", err);
    return responses.internalFailureResponse(res, err);
  }
};

const generateCV = async (req, res) => {
  try {
    const template = req.query.template || "template1";
    const userId = req.user.id || req.user._id;

    const pdfBuffer = await cvService.generateCV(userId, template);
    const user = await User.findById(userId).select("email name");
    if (user?.email) {
      await verifySendEmail(
        user.email,
        "CV Downloaded ✔",
        `Hi ${user.name}, your CV has been downloaded successfully.`
      );
    }
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=My_CV.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("CV GENERATE ERROR:", err);
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = { generateCV, previewCV };
