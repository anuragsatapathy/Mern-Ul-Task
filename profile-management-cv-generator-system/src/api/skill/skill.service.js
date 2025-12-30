const Skill = require("../../models/skillModel");

const addSkill = async (userId, data) => {
  const skill = new Skill({ ...data, userId });
  await skill.save();
  return { data: skill };
};

const getSkill = async (userId, offset = 0, limit = 10) => {
  const total = await Skill.countDocuments({
    userId,
    isDeleted: false,
  });

  const list = await Skill.find({
    userId,
    isDeleted: false,
  })
    .skip(Number(offset))
    .limit(Number(limit));

  return { data: list, total };
};

const updateSkill = async (id, data) => {
  const skill = await Skill.findByIdAndUpdate(id, data, { new: true });
  return { data: skill };
};

const deleteSkill = async (id) => {
  const skill = await Skill.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return { data: skill };
};

module.exports = {
  addSkill,
  getSkill,
  updateSkill,
  deleteSkill,
};
