import { useState } from "react";
import { TextField, Button, Box, IconButton, InputAdornment } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  const handleAction = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  // Logic to handle "Enter" key for sending
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAction();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1,
        bgcolor: "white",
        borderRadius: "24px", // Pill shape
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)", // Soft shadow
        border: "1px solid #eef0f2",
      }}
    >
    

      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        variant="standard" // Cleaner look
        InputProps={{
          disableUnderline: true, // Remove the bottom line
          sx: {
            fontSize: "0.95rem",
            color: "#333",
          }
        }}
      />

      <Button
        variant="contained"
        onClick={handleAction}
        disabled={!text.trim()}
        sx={{
          minWidth: "auto",
          width: 45,
          height: 45,
          borderRadius: "50%", // Circular button
          bgcolor: "#1e529e",
          boxShadow: "0 4px 10px rgba(30, 82, 158, 0.3)",
          "&:hover": {
            bgcolor: "#16417d",
            boxShadow: "0 6px 14px rgba(30, 82, 158, 0.4)",
          },
          "&.Mui-disabled": {
            bgcolor: "#e0e0e0",
          }
        }}
      >
        <SendIcon sx={{ fontSize: 20, ml: 0.5 }} />
      </Button>
    </Box>
  );
}