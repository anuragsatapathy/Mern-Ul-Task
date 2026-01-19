const Reference = require("../../models/referenceModel");

const addReference = async (userId, data) => {
  const reference = new Reference({ ...data, userId });
  await reference.save(); 
  return { data: reference };
};

const getReferences = async (userId, offset = 0, limit = 10) => {
  const total = await Reference.countDocuments({
    userId,
    isDeleted: false,
  });

  const list = await Reference.find({
    userId,
    isDeleted: false,
  })
    .skip(Number(offset))
    .limit(Number(limit));

  return { data: list, total };
};

const updateReference = async (id, data) => {
  const reference = await Reference.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true, 
    }
  );
  return { data: reference };
};

const deleteReference = async (id) => {
  const reference = await Reference.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return { data: reference };
};

module.exports = {
  addReference,
  getReferences,
  updateReference,
  deleteReference,
};
