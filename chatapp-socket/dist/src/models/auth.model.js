"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const User = mongoose_1.default.model("User", schema);
exports.default = User;
