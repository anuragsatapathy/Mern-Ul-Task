const educationService = require("./education.service");
const responses = require("../../utility/response");

const addEducation = async (req, res) => {
  const result = await educationService.addEducation(req.user.id, req.body);
  return responses.successResponse(res, result.data);
};

const getEducation = async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;

  const result = await educationService.getEducation(
    req.user.id,
    offset,
    limit
  );

  return responses.paginatedResponse(
    res,
    result.data,
    result.total,
    offset
  );
};

const updateEducation = async (req, res) => {
  const result = await educationService.updateEducation(
    req.params.id,
    req.body
  );
  return responses.successResponse(res, result.data);
};

const deleteEducation = async (req, res) => {
  const result = await educationService.deleteEducation(req.params.id);
  return responses.successResponse(res, result.data);
};

module.exports = {
  addEducation,
  getEducation,
  updateEducation,
  deleteEducation,
};
