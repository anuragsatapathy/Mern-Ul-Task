const prisma = require("../../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (data) => {
  try {
    
    if (!data.email || !data.password || !data.name) {
      return { status: 400, message: "Missing required fields" };
    }

    const exists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (exists) {
      return { status: 409, message: "User already exists" };
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
      },
    });

    return { status: 200, data: user };
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return { status: 500, message: err.message };
  }
};

const login = async (data) => {
  try {
    if (!data.email || !data.password) {
      return { status: 400, message: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return { status: 401, message: "Invalid credentials" };
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return { status: 401, message: "Invalid credentials" };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { status: 200, data: { token, user } };
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return { status: 500, message: err.message };
  }
};

module.exports = { register, login };
