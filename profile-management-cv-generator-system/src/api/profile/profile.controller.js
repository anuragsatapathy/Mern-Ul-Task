const profileService = require("./profile.service");
const responses = require("../../utility/response");

const saveProfile = async (req, res) => {
  try {
    const result = await profileService.saveProfile(req.user.id, req.body);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(res, false, result.message, result.status);
    }
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await profileService.getProfile(req.user.id);
    return responses.successResponse(res, result.data);
  } catch (err) {
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = { saveProfile, getProfile };
