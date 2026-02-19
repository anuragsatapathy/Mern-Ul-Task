"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = exports.getUsers = void 0;
const auth_model_1 = __importDefault(require("../../models/auth.model"));
const message_model_1 = __importDefault(require("../../models/message.model"));
const getUsers = async (currentUser) => {
    // Admin see all
    if (currentUser.role === "admin") {
        return auth_model_1.default.find({
            _id: { $ne: currentUser.id },
            isDeleted: false,
        }).select("-password");
    }
    // Normal user → only users he chatted with
    const messages = await message_model_1.default.find({
        $or: [
            { senderId: currentUser.id },
            { receiverId: currentUser.id },
        ],
    });
    const userIds = new Set();
    messages.forEach((msg) => {
        if (msg.senderId.toString() !== currentUser.id) {
            userIds.add(msg.senderId.toString());
        }
        if (msg.receiverId.toString() !== currentUser.id) {
            userIds.add(msg.receiverId.toString());
        }
    });
    return auth_model_1.default.find({
        _id: { $in: Array.from(userIds) },
        isDeleted: false,
    }).select("-password");
};
exports.getUsers = getUsers;
const searchUsers = async (currentUser, keyword) => {
    return auth_model_1.default.find({
        _id: { $ne: currentUser.id },
        name: { $regex: keyword, $options: "i" },
        isDeleted: false,
    }).select("-password");
};
exports.searchUsers = searchUsers;
