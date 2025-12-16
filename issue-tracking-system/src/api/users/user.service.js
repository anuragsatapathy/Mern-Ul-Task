const User = require("../../models/user.model");

const createUser = async (data) => {
  try {
    if (!data.name || !data.email || !data.password) {
      return { status: 400, message: "name, email and password are required", data: null };
    }

    const existing = await User.findOne({ email: data.email.toLowerCase(), isDeleted: false });
    if (existing) return { status: 409, message: "User with this email already exists", data: null };

    // caller can pass already-hashed password 
    const user = new User({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role || "developer",
    });

    await user.save();
    const userObj = user.toObject();
    delete userObj.password;

    return { status: 200, message: "User created successfully!", data: userObj };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getUsers = async ({ page = 1, limit = 10, q = null }) => {
  try {
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false };
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const [items, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return { status: 200, message: "Users fetched", data: { items, total, offset: skip } };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findOne({ _id: id, isDeleted: false }).select("-password").lean();
    if (!user) return { status: 404, message: "User not found", data: null };
    return { status: 200, message: "User fetched", data: user };
  } catch (error) {
    return { status: 500, message: error.message, data: null };
  }
};

module.exports = { createUser, getUsers, getUserById };
