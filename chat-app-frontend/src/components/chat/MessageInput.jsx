import { useState } from "react";
import { TextField,Button,Box } from "@mui/material";

export default function MessageInput({onSend}){
  const [text,setText]=useState("");

  return(
    <Box sx={{display:"flex",gap:1,mt:2}}>
      <TextField fullWidth value={text} onChange={(e)=>setText(e.target.value)}/>
      <Button variant="contained" onClick={()=>{onSend(text);setText("");}}>
        Send
      </Button>
    </Box>
  );
}
