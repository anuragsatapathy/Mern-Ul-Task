"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const message_model_1 = __importDefault(require("../../models/message.model"));
const getMessages = async (currentUserId, otherUserId) => {
    return message_model_1.default.find({
        $or: [
            { senderId: currentUserId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUserId },
        ],
    }).sort({ createdAt: 1 });
};
exports.getMessages = getMessages;
