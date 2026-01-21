const prisma = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (data) => {
  try {
    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) return { status: 409, message: "User already exists" };

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { ...data, password: hashed },
    });

    return { status: 200, data: user };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

const login = async (data) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) return { status: 401, message: "Invalid credentials" };

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return { status: 401, message: "Invalid credentials" };

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { status: 200, data: { token, user } };
  } catch (err) {
    return { status: 500, message: err.message };
  }
};

module.exports = { register, login };
