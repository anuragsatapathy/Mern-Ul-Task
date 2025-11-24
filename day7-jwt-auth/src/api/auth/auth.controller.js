const authService = require("./auth.service");

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: "User registered", user });
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Forgot Password
  async forgotPassword(req, res) {
    try {
      const response = await authService.forgotPassword(req.body.email);
      res.json(response);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }

  // Reset Password
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const response = await authService.resetPassword(token, password);
      res.json(response);
    } catch (error) {
      res.status(error.status || 500).json({ message: error.message });
    }
  }
}

module.exports = new AuthController();


