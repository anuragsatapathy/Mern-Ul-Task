const { Profile } = require("../../models/profile.model");

const createProfile = async (data) => await Profile.create(data);
const getAllProfiles = async () => await Profile.find().populate("userId", "name email");
const getProfileById = async (id) => await Profile.findById(id).populate("userId", "name email");
const updateProfile = async (id, data) => await Profile.findByIdAndUpdate(id, data, { new: true });
const deleteProfile = async (id) => await Profile.findByIdAndDelete(id);

module.exports = { createProfile, getAllProfiles, getProfileById, updateProfile, deleteProfile };
