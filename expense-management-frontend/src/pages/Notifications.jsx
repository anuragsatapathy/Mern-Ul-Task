import { Typography, Paper, Box } from "@mui/material";
import MainLayout from "../components/MainLayout";

export default function Notifications() {
  const message = localStorage.getItem("notification");

  return (
    <MainLayout>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Notifications
      </Typography>

      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          borderRadius: 2,
        }}
      >
        <Box textAlign="center">
          <Typography
            color={message ? "error.main" : "text.secondary"}
            fontWeight={message ? 600 : 400}
          >
            {message || "You have no new notifications"}
          </Typography>
        </Box>
      </Paper>
    </MainLayout>
  );
}
