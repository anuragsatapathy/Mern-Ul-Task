import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Popover,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Topbar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const prevUnreadRef = useRef(0);
  const permissionAskedRef = useRef(false);

  /* ASK PERMISSION  */
  useEffect(() => {
    const askPermissionOnce = async () => {
      if (
        "Notification" in window &&
        Notification.permission === "default" &&
        !permissionAskedRef.current
      ) {
        permissionAskedRef.current = true;
        await Notification.requestPermission();
      }
      document.removeEventListener("click", askPermissionOnce);
    };

    document.addEventListener("click", askPermissionOnce);
    return () =>
      document.removeEventListener("click", askPermissionOnce);
  }, []);

  /* LOAD NOTIFICATIONS */
  const loadNotifications = async () => {
    const res = await api.get("/notifications");
    const data = res.data.data || [];
    setNotifications(data);

    const unread = data.filter((n) => !n.isRead);

    if (
      Notification.permission === "granted" &&
      unread.length > prevUnreadRef.current
    ) {
      const latest = unread[0];
      new Notification(latest.title, {
        body: latest.message,
      });
    }

    prevUnreadRef.current = unread.length;
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener("refresh-notifications", loadNotifications);
    return () =>
      window.removeEventListener("refresh-notifications", loadNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const openNotifications = async (e) => {
    setAnchorEl(e.currentTarget);
    await api.post("/notifications/read");
    await loadNotifications();
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography fontWeight={600}>Expense Management</Typography>
          <Box flexGrow={1} />

          <IconButton onClick={openNotifications}>
            <Badge
              badgeContent={unreadCount}
              color="error"
              invisible={unreadCount === 0}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Notifications */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 320, maxHeight: 360, p: 2 } }}
      >
        <Typography fontWeight={600}>Notifications</Typography>

        <Box sx={{ maxHeight: 260, overflowY: "auto", mt: 1 }}>
          {notifications.length === 0 ? (
            <Typography color="text.secondary">
              No notifications
            </Typography>
          ) : (
            notifications.map((n) => (
              <Box key={n._id} mb={1}>
                <Typography fontWeight={600}>{n.title}</Typography>
                <Typography variant="body2">{n.message}</Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))
          )}
        </Box>

        <Box textAlign="right">
          <Button size="small" onClick={() => setAnchorEl(null)}>
            Close
          </Button>
        </Box>
      </Popover>

      {/* Profile */}
      <Popover
        open={Boolean(profileAnchor)}
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
      >
        <Box p={2}>
          <Button fullWidth onClick={() => navigate("/profile")}>
            Profile
          </Button>
          <Button
            fullWidth
            color="error"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
