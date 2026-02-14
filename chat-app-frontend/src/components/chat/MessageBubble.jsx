import { Box,Typography } from "@mui/material";

export default function MessageBubble({message}){
  return(
    <Box sx={{my:1}}>
      <Typography>{message.content}</Typography>
    </Box>
  );
}
