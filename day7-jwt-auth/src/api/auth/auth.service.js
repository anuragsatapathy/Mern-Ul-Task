const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../../models/user.model");

class AuthService {
  async register(data) {
    //old register code...
  }

  async login(data) {
    //old login code...
  }

  //forgot password
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) throw { status: 404, message: "User not found" };

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    return {
      message: "Reset token generated",
      resetLink: `http://localhost:4000/api/auth/reset-password/${resetToken}`,
    };
  }

  //reset password
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) throw { status: 400, message: "Invalid or expired token" };

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return { message: "Password reset successful" };
  }
}

module.exports = new AuthService();




