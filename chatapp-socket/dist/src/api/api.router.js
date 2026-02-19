"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth/auth.router"));
const user_router_1 = __importDefault(require("./user/user.router"));
const message_router_1 = __importDefault(require("./message/message.router"));
const chat_router_1 = __importDefault(require("./chat/chat.router"));
const router = (0, express_1.Router)();
router.use("/auth", auth_router_1.default);
router.use("/user", user_router_1.default);
router.use("/message", message_router_1.default);
router.use("/chat", chat_router_1.default);
exports.default = router;
