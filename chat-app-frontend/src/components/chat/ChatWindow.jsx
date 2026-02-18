import { useEffect, useState, useRef } from "react";
import { socket } from "../../context/SocketContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import axios from "../../api/axios";
import { Box, Typography, Avatar, AppBar, Toolbar, Divider, Chip } from "@mui/material";

export default function ChatWindow({ selectedUser }) {
  const [messages, setMessages] = useState([]);
  const currentUserId = localStorage.getItem("userId");
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 🔥 Load old messages - Logic untouched
  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get(`/message/${selectedUser._id}`)
      .then((res) => setMessages(res.data.data))
      .catch(() => console.log("Failed to load messages"));
  }, [selectedUser]);

  // 🔥 Socket Listener - Logic untouched
  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, []);

  // 🔥 Send Message - Logic untouched
  const sendMessage = (text) => {
    if (!selectedUser) return;

    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      content: text,
    });
  };

  /**
   * 🔥 UI Helper: Formats the date string for the separator
   */
  const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString([], { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  // Empty State UI
  if (!selectedUser) {
    return (
      <Box 
        sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center", 
          alignItems: "center",
          bgcolor: "#f8f9fa" 
        }}
      >
        <Avatar sx={{ width: 100, height: 100, bgcolor: "#e0e0e0", mb: 2 }}>
           💬
        </Avatar>
        <Typography variant="h6" color="textSecondary">
          Select a user to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#fff" }}>
      
      {/* 1. Professional Header */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: "white", borderBottom: "1px solid #eee" }}>
        <Toolbar>
          <Avatar 
            sx={{ bgcolor: "#1e529e", mr: 2, width: 40, height: 40 }}
          >
            {selectedUser.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ color: "#333", fontWeight: 600, lineHeight: 1.2 }}>
              {selectedUser.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#44b700" }}>
              Active Now
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. Chat Area with Date Separators */}
      <Box 
        ref={scrollRef}
        sx={{ 
          flex: 1, 
          overflowY: "auto", 
          p: 3, 
          bgcolor: "#f4f7fa", 
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "10px" }
        }}
      >
        {messages.map((m, index) => {
          // Check if date should be displayed
          const currentDate = new Date(m.createdAt).toDateString();
          const prevDate = index > 0 ? new Date(messages[index - 1].createdAt).toDateString() : null;
          const isNewDay = currentDate !== prevDate;

          return (
            <Box key={m._id || index} sx={{ display: "flex", flexDirection: "column" }}>
              {isNewDay && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                  <Chip 
                    label={getDateLabel(m.createdAt)} 
                    size="small"
                    sx={{ 
                      bgcolor: "rgba(0, 0, 0, 0.05)", 
                      color: "#666", 
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      borderRadius: "8px"
                    }} 
                  />
                </Box>
              )}
              <MessageBubble
                message={m}
                isOwn={m.senderId === currentUserId}
              />
            </Box>
          );
        })}
      </Box>

      <Divider />

      {/* 3. Message Input Area */}
      <Box sx={{ p: 2, bgcolor: "white" }}>
        <MessageInput onSend={sendMessage} />
      </Box>
    </Box>
  );
}