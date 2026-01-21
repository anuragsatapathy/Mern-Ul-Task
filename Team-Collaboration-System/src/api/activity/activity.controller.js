const service = require("./activity.service");
const responses = require("../../utility/response");

const getActivities = async (req, res) => {
  try {
    const result = await service.getActivities(req.user.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = { getActivities };
