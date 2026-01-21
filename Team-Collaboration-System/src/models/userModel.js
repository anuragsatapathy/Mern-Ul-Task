const prisma = require("../config/db");

const findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

module.exports = {
  findUserById,
};
