import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Topbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () =>
      setCount(Number(localStorage.getItem("notificationCount")) || 0);
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Left branding */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ color: "#2563eb", letterSpacing: 0.3 }}
          >
            Expense
          </Typography>
          <Typography
            variant="h6"
            fontWeight={500}
            sx={{ ml: 0.5, color: "#111827" }}
          >
            Management
          </Typography>
        </Box>

        {/* Spacer */}
        <Box flexGrow={1} />

        {/* Notifications */}
        <IconButton
          sx={{ mr: 1 }}
          onClick={() => navigate("/notifications")}
        >
          <Badge badgeContent={count} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Profile */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AccountCircleIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 160,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/profile");
            }}
          >
            Profile
          </MenuItem>

          <MenuItem
            onClick={logout}
            sx={{ color: "error.main" }}
          >
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

