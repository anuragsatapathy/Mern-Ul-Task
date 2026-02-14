import { useEffect, useState } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  Pagination,
  Fade
} from "@mui/material";
import Timeline from "@mui/icons-material/Timeline";
import HistoryIcon from '@mui/icons-material/History';
import { showError } from "../utils/toast";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/activity");
      setActivities(res.data.data || []);
    } catch {
      showError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  // Pagination Logic
  const handleChangePage = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const displayedActivities = activities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ 
      display: "flex", 
      minHeight: "100vh", 
      bgcolor: "#fcfdfe", // Softer professional white
      backgroundImage: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" 
    }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 8 }}>
        {/* Header Section */}
        <Stack direction="row" spacing={2} alignItems="center" mb={6}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 3, 
            bgcolor: "white", 
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)",
            display: "flex" 
          }}>
            <Timeline sx={{ fontSize: 32, color: "#6366f1" }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em" }}>
              Activity Log
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Keep track of your latest updates and task progress
            </Typography>
          </Box>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
            <CircularProgress thickness={5} sx={{ color: "#6366f1" }} />
          </Box>
        ) : activities.length === 0 ? (
          <Fade in={true}>
            <Paper sx={{ p: 8, textAlign: "center", borderRadius: 4, border: "1px dashed #cbd5e1", bgcolor: "transparent" }}>
              <HistoryIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
              <Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>No activity recorded yet</Typography>
            </Paper>
          </Fade>
        ) : (
          <Stack spacing={2.5}>
            {displayedActivities.map((a, index) => (
              <Fade in={true} timeout={(index % 10) * 100} key={a.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      borderColor: "#6366f1",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 600, color: "#334155", fontSize: "1.05rem" }}>
                      {a.message}
                    </Typography>

                    <Chip
                      label={a.type.replace("_", " ").toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: a.type.includes("COMPLETED") ? "#f0fdf4" : "#eef2ff",
                        color: a.type.includes("COMPLETED") ? "#16a34a" : "#4338ca",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        letterSpacing: "0.05em",
                        px: 1
                      }}
                    />
                  </Stack>

                  <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                      {new Date(a.createdAt).toLocaleDateString(undefined, { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#cbd5e1" }}>•</Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                      {new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Stack>
                </Paper>
              </Fade>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6, pb: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handleChangePage} 
                  shape="rounded"
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 600,
                      color: "#64748b"
                    },
                    '& .Mui-selected': {
                      bgcolor: "#6366f1 !important",
                      color: "white"
                    }
                  }}
                />
              </Box>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Activity;