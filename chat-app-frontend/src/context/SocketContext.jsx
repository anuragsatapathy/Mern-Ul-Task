import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: false,
  reconnection: true,            
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  const userId = localStorage.getItem("userId");

  if (!userId) return;

  if (!socket.connected) {
    socket.connect();
  }

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);

    socket.emit("join", userId);
    console.log("Joined room again:", userId);
  });
};
