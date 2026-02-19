import { Server, Socket } from "socket.io";
import Message from "../models/message.model";

const onlineUsers: Record<string, string> = {}; // store connected users

interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
}

const socketHandlers = (io: Server, socket: Socket): void => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId: string) => {
    if (!userId) return;

    socket.join(userId);

    // store user as online
    onlineUsers[userId] = socket.id;

    console.log("User joined room:", userId);

    // send updated online users list to everyone
    io.emit("online_users", Object.keys(onlineUsers));
  });

  socket.on("send_message", async (data: SendMessagePayload) => {
    try {
      const { senderId, receiverId, content } = data;

      if (!senderId || !receiverId || !content) return;

      const newMessage = await Message.create({
        senderId,
        receiverId,
        content,
      });

      const formattedMessage = {
        _id: newMessage._id.toString(),
        senderId: newMessage.senderId.toString(),
        receiverId: newMessage.receiverId.toString(),
        content: newMessage.content,
        createdAt: newMessage.createdAt,
      };

      io.to(senderId).emit("receive_message", formattedMessage);
      io.to(receiverId).emit("receive_message", formattedMessage);

      io.emit("refresh_sidebar");
    } catch (err) {
      console.log("Socket error:", err);
    }
  });

  socket.on("disconnect", () => {
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
      }
    }

    io.emit("online_users", Object.keys(onlineUsers));

    console.log("User disconnected:", socket.id);
  });
};

export default socketHandlers;
