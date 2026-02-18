import { Box, Typography, Paper } from "@mui/material";

export default function MessageBubble({ message }) {
  // Logic: Check if the message was sent by the current logged-in user
  const currentUserId = localStorage.getItem("userId");
  const isOwn = message.senderId === currentUserId;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start", // Sent on right, Received on left
        mb: 2,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: "75%", display: "flex", flexDirection: "column" }}>
        <Paper
          elevation={0}
          sx={{
            p: "10px 16px",
            // Dynamic styling based on who sent the message
            bgcolor: isOwn ? "#1e529e" : "white",
            color: isOwn ? "white" : "#333",
            borderRadius: isOwn 
              ? "20px 20px 4px 20px" // Rounded except bottom-right
              : "20px 20px 20px 4px", // Rounded except bottom-left
            boxShadow: isOwn 
              ? "0 4px 12px rgba(30, 82, 158, 0.2)" 
              : "0 2px 8px rgba(0,0,0,0.05)",
            border: isOwn ? "none" : "1px solid #eef0f2",
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: "0.95rem", 
              lineHeight: 1.5,
              wordBreak: "break-word" 
            }}
          >
            {message.content}
          </Typography>
        </Paper>

        {/* Optional Timestamp - subtle and elegant */}
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            px: 1,
            fontSize: "0.7rem",
            color: "#999",
            alignSelf: isOwn ? "flex-end" : "flex-start",
            fontWeight: 500,
          }}
        >
          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
        </Typography>
      </Box>
    </Box>
  );
}