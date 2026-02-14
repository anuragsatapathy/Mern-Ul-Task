import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Stack,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Schedule,
  EditOutlined,
  DeleteOutline,
  LayersOutlined,
  FiberManualRecord,
  ChevronRight,
} from "@mui/icons-material";
import axios from "../api/axios";

const statusColorMap = {
  todo: { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" },
  "in-progress": { bg: "#EEF2FF", text: "#4F46E5", border: "#C7D2FE" },
  done: { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
};

const priorityColorMap = {
  low: { color: "#10B981", label: "Low", bg: "rgba(16, 185, 129, 0.08)" },
  medium: { color: "#F59E0B", label: "Medium", bg: "rgba(245, 158, 11, 0.08)" },
  high: { color: "#EF4444", label: "High", bg: "rgba(239, 68, 68, 0.08)" },
};

const TaskCard = ({ task, onEdit, onDelete, onUpdate, role }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  // const normalizedStatus = task.status?.toLowerCase().replace("_", "-") || "todo";
  const normalizedStatus =
  task.status?.toLowerCase().replaceAll("_", "-") || "todo";
  const currentStatusStyle = statusColorMap[normalizedStatus] || statusColorMap.todo;

  const assignees =
    task.assignedUsers ||
    task.users ||
    task.assignees ||
    (task.user ? [task.user] : task.assignedUser ? [task.assignedUser] : []);

  const safeRole = String(role || "member").toLowerCase();
  const isOwnerOrAdmin = ["owner", "admin"].includes(safeRole);
  const isMember = safeRole === "member";

  const handleStatusClick = async (e) => {
    e.stopPropagation();
    if (!isMember || loading) return;

    let next =
      normalizedStatus === "todo"
        ? "in-progress"
        : normalizedStatus === "in-progress"
        ? "done"
        : "todo";

    setLoading(true);
    try {
      const response = await axios.put(`/tasks/${task.id}`, { status: next });
      // Call the parent update function instead of reloading the page
      if (onUpdate) onUpdate(response.data); 
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: "20px",
          border: "1px solid",
          borderColor: "rgba(226, 232, 240, 0.8)",
          background: "#FFFFFF",
          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
            borderColor: "#6366F1",
            "& .action-buttons": { opacity: 1, transform: "translateX(0)" },
          },
        }}
      >
        <CardContent sx={{ p: "24px !important", flexGrow: 1, display: "flex", flexDirection: "column" }}>
          
          {/* HEADER SECTION */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
            <Box sx={{ maxWidth: "75%" }}>
              {task.project?.workspace?.name && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "#818CF8",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    mb: 0.5,
                    display: "block",
                    fontSize: "0.6rem",
                  }}
                >
                  {task.project.workspace.name}
                </Typography>
              )}

              {task.project?.name && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LayersOutlined sx={{ fontSize: "0.85rem", color: "#94A3B8" }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748B", fontWeight: 600, fontSize: "0.75rem" }}
                  >
                    {task.project.name}
                  </Typography>
                </Stack>
              )}
            </Box>

            {/* ACTION BUTTONS */}
            {isOwnerOrAdmin && (
              <Stack
                direction="row"
                spacing={1}
                className="action-buttons"
                sx={{
                  opacity: { xs: 1, md: 0 },
                  transform: { xs: "none", md: "translateX(10px)" },
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}
                  sx={{ 
                    bgcolor: "#F8FAFC", 
                    color: "#64748B", 
                    "&:hover": { color: "#6366F1", bgcolor: "#EEF2FF" } 
                  }}
                >
                  <EditOutlined sx={{ fontSize: "1rem" }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => { e.stopPropagation(); setOpenDelete(true); }}
                  sx={{ 
                    bgcolor: "#F8FAFC", 
                    color: "#64748B", 
                    "&:hover": { color: "#EF4444", bgcolor: "#FEF2F2" } 
                  }}
                >
                  <DeleteOutline sx={{ fontSize: "1rem" }} />
                </IconButton>
              </Stack>
            )}
          </Box>

          {/* CONTENT SECTION */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0F172A",
              fontSize: "1.1rem",
              lineHeight: 1.4,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {task.title}
          </Typography>

          {task.description && (
            <Typography
              variant="body2"
              sx={{
                color: "#475569",
                mb: 3,
                fontSize: "0.9rem",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                opacity: 0.8,
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* STATUS SELECTOR */}
          <Box sx={{ mt: "auto", mb: 3 }}>
            <Chip
              label={task.status?.replace("_", " ")}
              onClick={handleStatusClick}
              disabled={loading}
              deleteIcon={isMember ? <ChevronRight sx={{ width: 14 }} /> : null}
              onDelete={isMember ? handleStatusClick : null}
              sx={{
                fontWeight: 700,
                fontSize: "0.65rem",
                bgcolor: currentStatusStyle.bg,
                color: currentStatusStyle.text,
                border: `1px solid ${currentStatusStyle.border}`,
                textTransform: "uppercase",
                height: "26px",
                px: 0.5,
                transition: "all 0.2s",
                cursor: isMember ? "pointer" : "default",
                "& .MuiChip-label": { px: 1.5 },
                "& .MuiChip-deleteIcon": { color: currentStatusStyle.text, opacity: 0.5 },
                "&:hover": isMember ? { filter: "brightness(0.95)" } : {},
              }}
            />
          </Box>

          <Divider sx={{ mb: 2, opacity: 0.5 }} />

          {/* FOOTER SECTION */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Tooltip title="Priority" arrow>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    px: 1.2,
                    py: 0.4,
                    borderRadius: "8px",
                    bgcolor: priorityColorMap[task.priority?.toLowerCase()]?.bg || "#F1F5F9",
                  }}
                >
                  <FiberManualRecord
                    sx={{
                      fontSize: "0.5rem",
                      color: priorityColorMap[task.priority?.toLowerCase()]?.color || "#94A3B8",
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "0.7rem" }}>
                    {task.priority}
                  </Typography>
                </Box>
              </Tooltip>

              {task.dueDate && (
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#64748B" }}>
                  <Schedule sx={{ fontSize: "0.9rem", opacity: 0.7 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.75rem" }}>
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Stack>
              )}
            </Stack>

            <AvatarGroup
              max={3}
              sx={{
                "& .MuiAvatar-root": {
                  width: 30,
                  height: 30,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  border: "2px solid #FFFFFF",
                  bgcolor: "#6366F1",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                },
              }}
            >
              {assignees.map((user, idx) => (
                <Tooltip key={user.id || idx} title={user.name} arrow>
                  <Avatar alt={user.name} src={user.avatarUrl}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        </CardContent>
      </Card>

      {/* DELETE DIALOG - Refined for elegance */}
      <Dialog 
        open={openDelete} 
        onClose={() => setOpenDelete(false)}
        PaperProps={{ 
          sx: { borderRadius: "24px", p: 1, width: "100%", maxWidth: "400px" },
          elevation: 20 
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.25rem", pt: 3 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#64748B", lineHeight: 1.6 }}>
            Are you sure you want to delete <span style={{ color: "#0F172A", fontWeight: 700 }}>"{task.title}"</span>? 
          
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            fullWidth
            onClick={() => setOpenDelete(false)} 
            sx={{ color: "#64748B", fontWeight: 700, borderRadius: "12px", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            color="error"
            variant="contained"
            disableElevation
            onClick={() => {
              setOpenDelete(false);
              onDelete?.(task);
            }}
            sx={{ 
              borderRadius: "12px", 
              fontWeight: 700, 
              textTransform: "none",
              bgcolor: "#EF4444",
              "&:hover": { bgcolor: "#DC2626" }
            }}
          >
            Delete Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCard;