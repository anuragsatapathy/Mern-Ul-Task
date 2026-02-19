"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 10, // 10 days TTL
    },
}, { timestamps: true });
schema.set("toJSON", {
    transform: (_doc, ret) => {
        ret._id = ret._id.toString();
        ret.senderId = ret.senderId.toString();
        ret.receiverId = ret.receiverId.toString();
        return ret;
    },
});
const Message = mongoose_1.default.model("Message", schema);
exports.default = Message;
