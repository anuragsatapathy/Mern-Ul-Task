const skillService = require("./skill.service");
const responses = require("../../utility/response");

const addSkill = async (req, res) => {
  const result = await skillService.addSkill(req.user.id, req.body);
  return responses.successResponse(res, result.data);
};

const getSkill = async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;

  const result = await skillService.getSkill(
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

const updateSkill = async (req, res) => {
  const result = await skillService.updateSkill(
    req.params.id,
    req.body
  );
  return responses.successResponse(res, result.data);
};

const deleteSkill = async (req, res) => {
  const result = await skillService.deleteSkill(req.params.id);
  return responses.successResponse(res, result.data);
};

module.exports = {
  addSkill,
  getSkill,
  updateSkill,
  deleteSkill,
};
