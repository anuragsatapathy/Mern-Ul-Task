const Hobby = require("../../models/hobbyModel");

const addHobby = async (userId, data) => {
  const hobby = new Hobby({ ...data, userId });
  await hobby.save();
  return { data: hobby };
};

const getHobbies = async (userId, offset = 0, limit = 10) => {
  const total = await Hobby.countDocuments({ userId, isDeleted: false });

  const list = await Hobby.find({ userId, isDeleted: false })
    .skip(Number(offset))
    .limit(Number(limit));

  return { data: list, total };
};

const updateHobby = async (id, data) => {
  const hobby = await Hobby.findByIdAndUpdate(id, data, { new: true });
  return { data: hobby };
};

const deleteHobby = async (id) => {
  const hobby = await Hobby.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return { data: hobby };
};

module.exports = {
  addHobby,
  getHobbies,
  updateHobby,
  deleteHobby,
};
