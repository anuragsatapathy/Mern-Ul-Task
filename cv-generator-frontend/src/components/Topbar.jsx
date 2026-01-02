import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Popover,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#ffb74d" }}>
        <Toolbar>
          <Typography fontWeight={700} color="#000">
            CV Profile Manager
          </Typography>
          <Box flexGrow={1} />
          <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
            <AccountCircleIcon sx={{ color: "#000" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box p={2} minWidth={160}>
          <Button
            fullWidth
            onClick={() => {
              setAnchor(null);
              navigate("/reset-password");
            }}
          >
            Reset Password
          </Button>
          <Button
            fullWidth
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
