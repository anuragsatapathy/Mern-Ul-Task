const authService = require('./auth.service');
const { success, error } = require('../../utility/responses');

class AuthController {
  static async register(req, res) {
    try {
      const user = await authService.register(req.body);
      // do not return password
      return success(res, { user }, 'User registered', 201);
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Registration failed', err.status || 500);
    }
  }

  static async login(req, res) {
    try {
      const result = await authService.login(req.body);
      return success(res, result, 'Login successful');
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Login failed', err.status || 500);
    }
  }

  static async forgotPassword(req, res) {
    try {
      await authService.forgotPassword(req.body.email);
      return success(res, {}, 'If the email exists, a reset link was sent');
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Forgot password failed', err.status || 500);
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;
      await authService.resetPassword(token, password);
      return success(res, {}, 'Password reset successful');
    } catch (err) {
      console.error(err);
      return error(res, err.message || 'Reset failed', err.status || 500);
    }
  }
}

module.exports = AuthController;



