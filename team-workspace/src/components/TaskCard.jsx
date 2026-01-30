import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AssignmentInd,
  Schedule,
  Flag,
  MoreVert as MoreIcon,
} from "@mui/icons-material";

import RoleGuard from "./RoleGuard";


const statusColorMap = {
  todo: { bg: "#f1f5f9", text: "#475569" }, 
  in_progress: { bg: "#fef3c7", text: "#92400e" }, 
  done: { bg: "#dcfce7", text: "#166534" }, 
};

const priorityColorMap = {
  low: "success",
  medium: "info",
  high: "error",
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  
  const normalizedStatus = task.status?.toLowerCase().replace(" ", "_");
  const currentStatusStyle = statusColorMap[normalizedStatus] || { bg: "#f1f5f9", text: "#475569" };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)",
          borderColor: "#6366f1",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
       
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box sx={{ pr: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                color: "#1e293b", 
                lineHeight: 1.2,
                fontSize: "1.1rem" 
              }}
            >
              {task.title}
            </Typography>
          </Box>

          <Box display="flex" sx={{ mt: -0.5 }}>
            <RoleGuard allow={["owner", "admin"]}>
              <Tooltip title="Edit Task">
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(task)}
                  sx={{ color: "#64748b", "&:hover": { color: "#6366f1", bgcolor: "#eef2ff" } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </RoleGuard>

            <RoleGuard allow={["owner", "admin"]}>
              <Tooltip title="Delete Task">
                <IconButton
                  size="small"
                  onClick={() => onDelete(task)}
                  sx={{ color: "#64748b", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </RoleGuard>
          </Box>
        </Box>

        {/* Description */}
        {task.description && (
          <Typography
            variant="body2"
            sx={{ 
              color: "#64748b", 
              mb: 2.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.6
            }}
          >
            {task.description}
          </Typography>
        )}

        <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

        <Box
          display="flex"
          gap={1}
          flexWrap="wrap"
          alignItems="center"
        >
       
          <Chip
            label={task.status?.replace("_", " ")}
            size="small"
            sx={{ 
              fontWeight: 700, 
              fontSize: "0.7rem",
              bgcolor: currentStatusStyle.bg, 
              color: currentStatusStyle.text,
              borderRadius: "6px",
              textTransform: "uppercase"
            }}
          />

      
          <Chip
            icon={<Flag sx={{ fontSize: "0.9rem !important" }} />}
            label={task.priority}
            size="small"
            color={priorityColorMap[task.priority?.toLowerCase()] || "default"}
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: "0.75rem", borderRadius: "6px" }}
          />

       
          {task.dueDate && (
            <Chip
              icon={<Schedule sx={{ fontSize: "0.9rem !important" }} />}
              label={new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              size="small"
              variant="outlined"
              sx={{ 
                fontWeight: 600, 
                fontSize: "0.75rem", 
                borderRadius: "6px",
                border: "1px solid #e2e8f0",
                color: "#64748b"
              }}
            />
          )}

       
          {task.assignedUser && (
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
               <Tooltip title={`Assigned to ${task.assignedUser.name}`}>
                  <Box 
                    sx={{ 
                      width: 24, height: 24, bgcolor: "#6366f1", 
                      color: "white", borderRadius: "50%", 
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700
                    }}
                  >
                    {task.assignedUser.name.charAt(0)}
                  </Box>
               </Tooltip>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;