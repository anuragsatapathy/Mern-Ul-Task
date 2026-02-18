import { createContext } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
});

export const connectSocket = () => {
  const userId = localStorage.getItem("userId");

  if (!userId) return;

  // If already connected, don't reconnect
  if (!socket.connected) {
    socket.connect();
  }

  // After connection, join room
  socket.off("connect"); // prevent duplicate listeners
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    socket.emit("join", userId);
    console.log("Joined room:", userId);
  });
};

// AUTO CONNECT AFTER REFRESH
const userId = localStorage.getItem("userId");
if (userId) {
  connectSocket();
}

export const SocketContext = createContext(socket);
