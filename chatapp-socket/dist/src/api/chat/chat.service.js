"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChats = exports.createChat = void 0;
const chat_model_1 = __importDefault(require("../../models/chat.model"));
const createChat = async (data) => {
    return chat_model_1.default.create(data);
};
exports.createChat = createChat;
const getChats = async (userId) => {
    return chat_model_1.default.find({ participants: userId, isDeleted: false });
};
exports.getChats = getChats;
