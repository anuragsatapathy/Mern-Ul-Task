const analyticsService = require("./analytics.service");
const responses = require("../../utility/response");

const getDashboard = async (req, res) => {
  try {
    const data = await analyticsService.getDashboardAnalytics(req.user.id);
    return responses.successResponse(res, data);
  } catch (error) {
    return responses.internalFailureResponse(res, error);
  }
};

module.exports = { getDashboard };
