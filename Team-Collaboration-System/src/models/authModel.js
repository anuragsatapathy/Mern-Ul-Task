const prisma = require("../config/db");

const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

const createUser = (data) => {
  return prisma.user.create({
    data,
  });
};

module.exports = {
  findUserByEmail,
  createUser,
};
