import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useState } from "react";
import { socket } from "../context/SocketContext";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

const logout = () => {
  localStorage.clear();
  socket.disconnect();
  navigate("/", { replace: true }); 
};


  return (
    <Box 
      sx={{ 
        display: "flex", 
        height: "100vh", 
        width: "100vw", 
        bgcolor: "#f4f7fa", 
        overflow: "hidden" 
      }}
    >
      {/* Sidebar Area */}
      <Sidebar onSelectUser={setSelectedUser} />

      {/* Main Chat Area */}
      <Box 
        sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column", 
          position: "relative",
          height: "100%" 
        }}
      >
      
        <Box 
          sx={{ 
            position: "absolute", 
            top: 12, 
            right: 20, 
            zIndex: 1100 
          }}
        >
          <Button 
            onClick={logout} 
            variant="contained" 
            startIcon={<LogoutIcon sx={{ fontSize: "1.2rem !important" }} />}
            sx={{ 
              textTransform: "none",
              bgcolor: "rgba(255, 255, 255, 0.9)",
              color: "#d32f2f",
              fontWeight: 600,
              borderRadius: "10px",
              px: 2,
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(211, 47, 47, 0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              "&:hover": {
                bgcolor: "#fff",
                boxShadow: "0 6px 16px rgba(211, 47, 47, 0.1)",
                border: "1px solid rgba(211, 47, 47, 0.5)",
              }
            }}
          >
            Logout
          </Button>
        </Box>

       
        <ChatWindow selectedUser={selectedUser} />
      </Box>
    </Box>
  );
}