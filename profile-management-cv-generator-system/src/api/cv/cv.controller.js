const cvService = require("./cv.service");
const responses = require("../../utility/response");

const generateCV = async (req, res) => {
  try {
    const userId = req.user.id;

    const pdfBuffer = await cvService.generateCV(userId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=My_CV.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = { generateCV };

