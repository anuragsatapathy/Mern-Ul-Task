const analyticsService = require("./analytics.service");
const responses = require("../../utility/response");

const dashboard = async (req, res) => {
  try {
    const result = await analyticsService.dashboard(req.query.workspaceId);

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

module.exports = {
  dashboard,
};
