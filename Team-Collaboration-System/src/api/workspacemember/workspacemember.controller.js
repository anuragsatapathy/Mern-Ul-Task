const service = require("./workspacemember.service");
const responses = require("../../utility/response");

const addMember = async (req, res) => {
  try {
    const result = await service.addMember(req.body);

    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const updateRole = async (req, res) => {
  try {
    const result = await service.updateRole(req.body);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const removeMember = async (req, res) => {
  try {
    const result = await service.removeMember(req.body);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  addMember,
  updateRole,
  removeMember,
};
