"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socket_handlers_1 = __importDefault(require("../socket/socket.handlers"));
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
        (0, socket_handlers_1.default)(io, socket);
    });
};
exports.default = initSocket;
