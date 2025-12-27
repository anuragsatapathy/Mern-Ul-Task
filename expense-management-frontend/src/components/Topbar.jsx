import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Popover,
  Typography,
  Box,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function Topbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // fetch notifications from backend
  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to load notifications");
    }
  };

  // load once on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  // unread count ALWAYS derived from backend data
  const unreadCount = notifications.filter(
    (n) => n.isRead === false
  ).length;

  // open notification panel
  const openNotifications = async (e) => {
    setAnchorEl(e.currentTarget);

    try {
      // mark all as read in backend
      await api.post("/notifications/read");

      // refetch so unreadCount becomes 0
      await loadNotifications();
    } catch (err) {
      console.error("Failed to mark notifications as read");
    }
  };

  const closeNotifications = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography fontWeight={600}>
            Expense Management
          </Typography>

          <Box flexGrow={1} />

          {/* NOTIFICATION ICON */}
          <IconButton onClick={openNotifications}>
            <Badge
              badgeContent={unreadCount}
              color="error"
              invisible={unreadCount === 0}   // 🔥 IMPORTANT
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* NOTIFICATION POPOVER */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={closeNotifications}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 320,
            p: 2,
          },
        }}
      >
        <Typography fontWeight={600} mb={1}>
          Notifications
        </Typography>

        {notifications.length === 0 ? (
          <Typography color="text.secondary">
            No notifications
          </Typography>
        ) : (
          notifications.map((n) => (
            <Box key={n._id} mb={1.5}>
              <Typography fontWeight={600}>
                {n.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {n.message}
              </Typography>
            </Box>
          ))
        )}

        <Box textAlign="right" mt={1}>
          <Button size="small" onClick={closeNotifications}>
            Close
          </Button>
        </Box>
      </Popover>
    </>
  );
}
