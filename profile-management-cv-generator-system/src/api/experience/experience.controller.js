const experienceService = require("./experience.service");
const responses = require("../../utility/response");

const addExperience = async (req, res) => {
  const result = await experienceService.addExperience(req.user.id, req.body);
  return responses.successResponse(res, result.data);
};

const getExperience = async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;

  const result = await experienceService.getExperience(
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

const updateExperience = async (req, res) => {
  const result = await experienceService.updateExperience(
    req.params.id,
    req.body
  );
  return responses.successResponse(res, result.data);
};

const deleteExperience = async (req, res) => {
  const result = await experienceService.deleteExperience(req.params.id);
  return responses.successResponse(res, result.data);
};

module.exports = {
  addExperience,
  getExperience,
  updateExperience,
  deleteExperience,
};
