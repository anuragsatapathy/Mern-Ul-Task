const User = require("../../models/user.model");

class UserService {
  async createUser(data) {
    return await User.create(data);
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: "User not found" };
    return user;
  }

  async getAllUsers() {
    return await User.find();
  }
}

module.exports = new UserService();

