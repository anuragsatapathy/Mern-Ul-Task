const UserService = require('./user.service');
const { success, error } = require('../../utility/responses');

class UserController {
  static async getAll(req, res) {
    try {
      const users = await UserService.getAll();
      return success(res, users);
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async getById(req, res) {
    try {
      const user = await UserService.getById(req.params.id);
      if (!user) return error(res, 'User not found', 404);
      return success(res, user);
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async update(req, res) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      return success(res, user, 'User updated');
    } catch (err) {
      return error(res, err.message);
    }
  }

  static async remove(req, res) {
    try {
      await UserService.remove(req.params.id);
      return success(res, {}, 'User removed');
    } catch (err) {
      return error(res, err.message);
    }
  }
}

module.exports = UserController;


