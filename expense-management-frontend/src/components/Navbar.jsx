import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const SIDEBAR_WIDTH = 180;

export default function Navbar() {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const readCount = () => {
      const value =
        Number(localStorage.getItem("notificationCount")) || 0;
      setNotificationCount(value);
    };

    readCount();
    window.addEventListener("storage", readCount);

    return () =>
      window.removeEventListener("storage", readCount);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid #e0e0e0",
        px: 1.5,
        py: 2,
        bgcolor: "#fafafa",
      }}
    >
      <Typography
        variant="h6"
        mb={2}
        sx={{
          pl: 1,
          color: "primary.main",
          fontWeight: 600,
        }}
      >
        Expense App
      </Typography>

      <List sx={{ p: 0 }}>
        {[
          ["Home", "/home"],
          ["Dashboard", "/dashboard"],
          ["Add Expense", "/add-expense"],
          ["Expenses", "/expenses"],
          ["Budget", "/budget"],
        ].map(([label, path]) => (
          <ListItemButton
            key={label}
            onClick={() => navigate(path)}
            sx={{ borderRadius: 1 }}
          >
            <ListItemText primary={label} />
          </ListItemButton>
        ))}

        <ListItemButton onClick={() => navigate("/notifications")}>
          <Badge
            color="error"
            badgeContent={notificationCount}
            invisible={notificationCount === 0}
          >
            <NotificationsIcon fontSize="small" />
          </Badge>
          <ListItemText primary="Notifications" sx={{ ml: 1 }} />
        </ListItemButton>

        <ListItemButton onClick={logout}>
          <LogoutIcon fontSize="small" />
          <ListItemText primary="Logout" sx={{ ml: 1 }} />
        </ListItemButton>
      </List>
    </Box>
  );
}
