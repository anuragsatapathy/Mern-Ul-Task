const referenceService = require("./reference.service");
const responses = require("../../utility/response");

const addReference = async (req, res) => {
  const result = await referenceService.addReference(
    req.user.id,
    req.body
  );
  return responses.successResponse(res, result.data);
};

const getReferences = async (req, res) => {
  const { offset = 0, limit = 10 } = req.query;

  const result = await referenceService.getReferences(
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

const updateReference = async (req, res) => {
  const result = await referenceService.updateReference(
    req.params.id,
    req.body
  );
  return responses.successResponse(res, result.data);
};

const deleteReference = async (req, res) => {
  const result = await referenceService.deleteReference(req.params.id);
  return responses.successResponse(res, result.data);
};

module.exports = {
  addReference,
  getReferences,
  updateReference,
  deleteReference,
};
