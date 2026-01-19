const hobbyService = require("./hobby.service");
const responses = require("../../utility/response");

const addHobby = async (req, res) => {
  const result = await hobbyService.addHobby(req.user.id, req.body);
  return responses.successResponse(res, result.data);
};

const getHobbies = async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;

  const result = await hobbyService.getHobbies(
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

const updateHobby = async (req, res) => {
  const result = await hobbyService.updateHobby(
    req.params.id,
    req.body
  );
  return responses.successResponse(res, result.data);
};

const deleteHobby = async (req, res) => {
  const result = await hobbyService.deleteHobby(req.params.id);
  return responses.successResponse(res, result.data);
};

module.exports = {
  addHobby,
  getHobbies,
  updateHobby,
  deleteHobby,
};
