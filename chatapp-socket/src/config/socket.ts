import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import socketHandlers from "../socket/socket.handlers";

let io: Server;

const initSocket = (server: HttpServer): void => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket: Socket) => {
    socketHandlers(io, socket);
  });
};

export default initSocket;
