import { useEffect, useState } from "react";
import { socket } from "../../context/SocketContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Box, Typography } from "@mui/material";

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("ChatWindow mounted, socket id:", socket.id);

    const handleReceive = (msg) => {
      console.log("🔥 RECEIVED MESSAGE:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, []);

  const sendMessage = (text) => {
    if (!selectedUser) return;

    const senderId = localStorage.getItem("userId");

    const data = {
      senderId,
      receiverId: selectedUser._id,
      content: text,
    };

    console.log("🚀 Sending:", data);

    socket.emit("send_message", data);

    setMessages((prev) => [...prev, data]);
  };

  if (!selectedUser) {
    return <Box sx={{ flex: 1, p: 3 }}>Select a user to chat</Box>;
  }

  return (
    <Box sx={{ flex: 1, p: 2 }}>
      <Typography variant="h6">{selectedUser.email}</Typography>

      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}

      <MessageInput onSend={sendMessage} />
    </Box>
  );
}
