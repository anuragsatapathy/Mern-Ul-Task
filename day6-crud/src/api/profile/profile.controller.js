const { createProfile, getAllProfiles, getProfileById, updateProfile, deleteProfile } = require("./profile.service");
const { successResponse, errorResponse } = require("../../utility/responses");

const createProfileCtrl = async (req, res) => {
  try {
    const profile = await createProfile(req.body);
    successResponse(res, profile, "Profile created successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getAllProfilesCtrl = async (req, res) => {
  try {
    const profiles = await getAllProfiles();
    successResponse(res, profiles);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getProfileByIdCtrl = async (req, res) => {
  try {
    const profile = await getProfileById(req.params.id);
    if (!profile) return errorResponse(res, "Profile not found", 404);
    successResponse(res, profile);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updateProfileCtrl = async (req, res) => {
  try {
    const profile = await updateProfile(req.params.id, req.body);
    if (!profile) return errorResponse(res, "Profile not found", 404);
    successResponse(res, profile, "Profile updated successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const deleteProfileCtrl = async (req, res) => {
  try {
    const profile = await deleteProfile(req.params.id);
    if (!profile) return errorResponse(res, "Profile not found", 404);
    successResponse(res, profile, "Profile deleted successfully");
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = { createProfileCtrl, getAllProfilesCtrl, getProfileByIdCtrl, updateProfileCtrl, deleteProfileCtrl };
