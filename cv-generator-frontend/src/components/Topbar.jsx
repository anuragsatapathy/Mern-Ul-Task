import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Popover,
  Button,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const [profileAnchor, setProfileAnchor] = useState(null);

  const openProfileMenu = (e) => {
    setProfileAnchor(e.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileAnchor(null);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#ffb74d" }}>
        <Toolbar>
          <Typography fontWeight={600} color="#000">
            CV Profile Manager
          </Typography>

          <Box flexGrow={1} />

          <IconButton onClick={openProfileMenu}>
            <AccountCircleIcon sx={{ color: "#000" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* PROFILE */}
      <Popover
        open={Boolean(profileAnchor)}
        anchorEl={profileAnchor}
        onClose={closeProfileMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box p={2} minWidth={180}>
          {/*RESET PASSWORD */}
          <Button
            fullWidth
            onClick={() => {
              closeProfileMenu();
              navigate("/reset-password");
            }}
          >
            Reset Password
          </Button>

          {/* LOGOUT */}
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
