"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = __importDefault(require("../utility/response"));
const jwtValidation = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            response_1.default.authFailureResponse(res, "No token provided");
            return;
        }
        const parsedToken = token.startsWith("Bearer ")
            ? token.split(" ")[1]
            : token;
        const decoded = jsonwebtoken_1.default.verify(parsedToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        response_1.default.authFailureResponse(res, "Invalid token");
    }
};
exports.default = jwtValidation;
