const Education = require("../../models/educationModel");

const addEducation = async (userId, data) => {
  const edu = new Education({ ...data, userId });
  await edu.save();
  return { data: edu };
};

const getEducation = async (userId, offset = 0, limit = 10) => {
  const total = await Education.countDocuments({
    userId,
    isDeleted: false,
  });

  const list = await Education.find({
    userId,
    isDeleted: false,
  })
    .skip(Number(offset))
    .limit(Number(limit));

  return { data: list, total };
};

const updateEducation = async (id, data) => {
  const edu = await Education.findByIdAndUpdate(id, data, { new: true });
  return { data: edu };
};

const deleteEducation = async (id) => {
  const edu = await Education.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return { data: edu };
};

module.exports = {
  addEducation,
  getEducation,
  updateEducation,
  deleteEducation,
};

