const cvService = require("./cv.service");
const responses = require("../../utility/response");

const previewCV = async (req, res) => {
  try {
    const html = await cvService.buildCVHTML(req.user.id);
    return res.send(html);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const generateCV = async (req, res) => {
  try {
    const pdfBuffer = await cvService.generateCV(req.user.id);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=My_CV.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = { generateCV, previewCV };


