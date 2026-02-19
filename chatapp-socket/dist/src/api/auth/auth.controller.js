"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const service = __importStar(require("./auth.service"));
const response_1 = __importDefault(require("../../utility/response"));
const register = async (req, res) => {
    try {
        const data = await service.register(req.body);
        return response_1.default.successResponse(res, data);
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Something went wrong";
        console.log("REGISTER ERROR:", errorMessage);
        return response_1.default.badRequestResponse(res, errorMessage);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const data = await service.login(req.body);
        if (!data) {
            return response_1.default.authFailureResponse(res, "Invalid email or password");
        }
        return response_1.default.successResponse(res, data);
    }
    catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Something went wrong";
        console.log("LOGIN ERROR:", errorMessage);
        return response_1.default.badRequestResponse(res, errorMessage);
    }
};
exports.login = login;
