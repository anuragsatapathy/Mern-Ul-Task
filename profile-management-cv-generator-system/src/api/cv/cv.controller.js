const cvService = require("./cv.service");
const responses = require("../../utility/response");

const generateCV = async (req, res) => {
  try {
    const result = await cvService.generateCV(req.user.id, res);
    return result;
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = { generateCV };
