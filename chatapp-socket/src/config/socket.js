const { Server } = require("socket.io");
const socketHandlers = require("../socket/socket.handlers");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socketHandlers(io, socket);
  });
};

module.exports = initSocket;
