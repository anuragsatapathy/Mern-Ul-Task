const userService = require("./userService");

class UserController {
  async getUser(req, res) {
    try {
      const user = await userService.findUserById(req.params.id);
      return res.json(user);
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || "Something went wrong",
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}

module.exports = new UserController();

