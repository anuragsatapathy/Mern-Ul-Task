const express = require("express");
const router = express.Router();

const authRoutes = require("./auth/auth.router");
const userRoutes = require("./user/user.router");
const messageRoutes = require("./message/message.router");
const chatRoutes = require("./chat/chat.router");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/message", messageRoutes);
router.use("/chat", chatRoutes);

module.exports = router;
