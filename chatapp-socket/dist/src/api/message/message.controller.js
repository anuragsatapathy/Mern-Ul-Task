"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = void 0;
const message_model_1 = __importDefault(require("../../models/message.model"));
const response_1 = __importDefault(require("../../utility/response"));
const getMessages = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.chatId;
        const messages = await message_model_1.default.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        }).sort({ createdAt: 1 });
        return response_1.default.successResponse(res, messages);
    }
    catch (err) {
        console.log(err);
        return response_1.default.internalFailureResponse(res);
    }
};
exports.getMessages = getMessages;
