const Profile = require("../../models/profileModel");

const saveProfile = async (userId, data) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...data, userId },
      { new: true, upsert: true }
    );
    return { status: 200, data: profile };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getProfile = async (userId) => {
  const profile = await Profile.findOne({ userId });
  return { data: profile };
};

module.exports = { saveProfile, getProfile };
