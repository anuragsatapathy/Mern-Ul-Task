import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { showError } from "../utils/toast";


const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    try {
      const res = await axios.get("/activities");
      setActivities(res.data.data || []);
    } catch (err) {
      showError(
        err.response?.data?.message || "Failed to load activity log"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={3}>
          Activity Log
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : activities.length === 0 ? (
          <Typography color="text.secondary">
            No recent activity found.
          </Typography>
        ) : (
          <Paper
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            }}
          >
            <List disablePadding>
              {activities.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem
                    sx={{
                      px: 3,
                      py: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography fontWeight={600}>
                          {activity.action}
                        </Typography>
                      }
                      secondary={
                        activity.createdAt
                          ? new Date(activity.createdAt).toLocaleString()
                          : ""
                      }
                    />
                  </ListItem>

                  {index !== activities.length - 1 && (
                    <Divider sx={{ mx: 3 }} />
                  )}
                </Box>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Activity;
