import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";


const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function Topbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [count, setCount] = useState(0);

  const currentMonth = getCurrentMonth();

  useEffect(() => {
    const read = () => {
      const notifMonth = localStorage.getItem("notificationMonth");
      const storedCount =
        Number(localStorage.getItem("notificationCount")) || 0;

      setCount(
        notifMonth === currentMonth ? storedCount : 0
      );
    };

    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, [currentMonth]);

  const openNotifications = () => {
    setNotifOpen(true);

    if (localStorage.getItem("notificationMonth") === currentMonth) {
      localStorage.setItem("notificationCount", "0");
      window.dispatchEvent(new Event("storage"));
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const message =
    localStorage.getItem("notificationMonth") === currentMonth
      ? localStorage.getItem("notification")
      : null;

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ px: 4 }}>
          <Box onClick={() => navigate("/dashboard")} sx={{ cursor: "pointer" }}>
            <Typography fontWeight={700}>Expense Management</Typography>
          </Box>

          <Box flexGrow={1} />

          <IconButton onClick={openNotifications}>
            <Badge badgeContent={count} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <AccountCircleIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
            <MenuItem onClick={logout} sx={{ color: "error.main" }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Dialog open={notifOpen} onClose={() => setNotifOpen(false)}>
        <DialogTitle>Notifications</DialogTitle>
        <DialogContent>
          <Typography color={message ? "error.main" : "text.secondary"}>
            {message || "You have no new notifications"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotifOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
