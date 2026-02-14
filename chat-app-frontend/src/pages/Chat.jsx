import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar onSelectUser={setSelectedUser} />
      <ChatWindow selectedUser={selectedUser} />
    </Box>
  );
}
