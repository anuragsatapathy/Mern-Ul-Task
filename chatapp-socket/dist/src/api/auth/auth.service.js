"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_model_1 = __importDefault(require("../../models/auth.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (data) => {
    const { name, email, password, role } = data;
    const existing = await auth_model_1.default.findOne({ email });
    if (existing) {
        throw new Error("Email already exists");
    }
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await auth_model_1.default.create({
        name,
        email,
        password: hash,
        role: role || "user",
    });
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
};
exports.register = register;
const login = async (data) => {
    const { email, password } = data;
    const user = await auth_model_1.default.findOne({ email });
    if (!user)
        return null;
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match)
        return null;
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1h"),
    };
    const token = jsonwebtoken_1.default.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, options);
    const userObj = user.toObject();
    delete userObj.password;
    return {
        user: userObj,
        token,
    };
};
exports.login = login;
