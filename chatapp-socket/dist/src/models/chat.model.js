"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    participants: [String],
    lastMessage: String,
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const Chat = mongoose_1.default.model("Chat", schema);
exports.default = Chat;
