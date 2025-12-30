const Experience = require("../../models/experienceModel");

const addExperience = async (userId, data) => {
  const experience = new Experience({ ...data, userId });
  await experience.save();
  return { data: experience };
};

const getExperience = async (userId, offset = 0, limit = 10) => {
  const total = await Experience.countDocuments({
    userId,
    isDeleted: false,
  });

  const list = await Experience.find({
    userId,
    isDeleted: false,
  })
    .skip(Number(offset))
    .limit(Number(limit));

  return { data: list, total };
};

const updateExperience = async (id, data) => {
  const exp = await Experience.findByIdAndUpdate(id, data, { new: true });
  return { data: exp };
};

const deleteExperience = async (id) => {
  const exp = await Experience.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return { data: exp };
};

module.exports = {
  addExperience,
  getExperience,
  updateExperience,
  deleteExperience,
};
