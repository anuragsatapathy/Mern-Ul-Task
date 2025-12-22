import { Box, Typography } from "@mui/material";
import Navbar, { SIDEBAR_WIDTH } from "../components/Navbar";

export default function Notifications() {
  const message = localStorage.getItem("notification");

  return (
    <>
      <Navbar />

      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Typography variant="h5">
          Notifications
        </Typography>

        <Typography
          mt={2}
          color={message ? "error" : "text.secondary"}
        >
          {message || "No notifications"}
        </Typography>
      </Box>
    </>
  );
}
