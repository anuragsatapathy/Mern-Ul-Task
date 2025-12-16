const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const responses = require("../utility/response");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return responses.authFailureResponse(res, "Token missing");

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      return responses.authFailureResponse(res, "Invalid token");
    }

    const user = await User.findOne({ _id: payload.id, isDeleted: false }).select("-password").lean();
    if (!user) return responses.authFailureResponse(res, "User not found");

    req.user = { id: user._id.toString(), email: user.email, role: user.role, name: user.name };
    next();
  } catch (err) {
    return responses.internalFailureResponse(res, err.message || err);
  }
};

module.exports = authMiddleware;
