import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import RoleGuard from "../components/RoleGuard";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Stack,
  Container,
  FormControl,
  InputLabel,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Grid,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
  CalendarMonth as CalendarIcon,
  Search as SearchIcon,
  AssignmentOutlined as ProjectIcon,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";

const ITEMS_PER_PAGE = 10;

const ProjectPreview = () => {
  /* ================= LOGIC (UNCHANGED) ================= */
  const { projectId } = useParams();
  const workspaceRole = localStorage.getItem("workspaceRole");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    assigneeId: "",
  });
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loadProject = async () => {
    const res = await axios.get(`/projects/${projectId}`);
    setProject(res.data.data);
  };

  const loadTasks = async () => {
    const res = await axios.get(`/tasks/project/${projectId}`);
    setTasks(res.data.data || []);
  };

  const loadMembers = async () => {
    if (!projectId) return;
    try {
      const res = await axios.get(`/workspaces/members/by-project/${projectId}`);
      setMembers(res.data.data || []);
    } catch (error) {
      console.error("Failed to load project members", error);
      setMembers([]);
    }
  };

      useEffect(() => {
        const loadAll = async () => {
          try {
            setLoading(true);

            setTasks([]);       
            setProject(null);   

            await Promise.all([
              loadProject(),
              loadTasks(),
              loadMembers()
            ]);

          } catch {
            showError("Failed to load data");
          } finally {
            setLoading(false);
          }
        };

        if (projectId) {
          loadAll();
        }
      }, [projectId]);


  const openCreateDialog = () => {
    setEditTaskId(null);
    setTaskData({ title: "", description: "", status: "todo", priority: "medium", dueDate: "", assigneeId: "" });
    setOpenTaskDialog(true);
  };

  const openEditDialog = (task) => {
    setEditTaskId(task.id);
    setTaskData({
      title: task.title,
      description: task.description || "",
      // status: task.status,
      // priority: task.priority,
      status: task.status?.toLowerCase().replace("_", "-"),
      priority: task.priority?.toLowerCase(),
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assigneeId: task.user?.id || "",
    });
    setOpenTaskDialog(true);
  };

  const submitTask = async () => {
    if (!taskData.title.trim()) {
      showError("Task title is required");
      return;
    }
    try {
      if (editTaskId) {
        await axios.put(`/tasks/${editTaskId}`, taskData);
        showSuccess("Task updated");
      } else {
        await axios.post("/tasks", { ...taskData, projectId });
        showSuccess("Task created");
      }
      setOpenTaskDialog(false);
      loadTasks();
    } catch {
      showError("Operation failed");
    }
  };

  const deleteTask = async () => {
    try {
      await axios.delete(`/tasks/${deleteTaskId}`);
      showSuccess("Task deleted");
      setDeleteTaskId(null);
      loadTasks();
    } catch {
      showError("Failed to delete task");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, search]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTasks, page]);

  /*  UI HELPERS */
  const getPriorityStyles = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "high") return { color: "#ef4444", bg: "#fef2f2", label: "High" };
    if (p === "medium") return { color: "#f59e0b", bg: "#fffbeb", label: "Medium" };
    return { color: "#10b981", bg: "#f0fdf4", label: "Low" };
  };

  const getStatusConfig = (status) => {
    if (status === "todo") return { color: "#64748b", bg: "#f1f5f9", label: "To Do" };
    if (status === "in-progress") return { color: "#3b82f6", bg: "#eff6ff", label: "In Progress" };
    if (status === "done") return { color: "#10b981", bg: "#f0fdf4", label: "Done" };
    return { color: "#6366f1", bg: "#f5f3ff", label: status };
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress thickness={4} size={45} sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fcfdfe" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* TOP BAR / HEADER */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 850, color: "#1e293b", letterSpacing: "-0.02em" }}>
              {project?.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <Chip 
                icon={<ProjectIcon style={{ fontSize: 16, color: 'inherit' }} />} 
                label="Active Project" 
                size="small" 
                sx={{ bgcolor: "#e0e7ff", color: "#4338ca", fontWeight: 700, borderRadius: "6px" }} 
              />
            </Stack>
          </Box>

          <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                bgcolor: "#6366f1",
                boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
                "&:hover": { bgcolor: "#4f46e5" },
              }}
            >
              Add New Task
            </Button>
          </RoleGuard>
        </Box>

        {/* COMPACT PROJECT CARD */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "4px",
              height: "100%",
              bgcolor: "#6366f1",
            }
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ p: 1, bgcolor: "#f1f5f9", borderRadius: 2, display: 'flex' }}>
                  <ProjectIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", fontSize: "0.65rem" }}>
                    Project Details
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", lineHeight: 1.2 }}>
                    {project?.name}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
              <Divider orientation="vertical" flexItem sx={{ height: 40, borderColor: '#e2e8f0' }} />
            </Grid>

            <Grid item xs={12} md={7}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#64748b", textTransform: "uppercase", fontSize: "0.65rem", mb: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {project?.description || "Tracking deliverables, milestones, and team tasks for this workspace."}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* SEARCH SECTION */}
        <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
           <TextField
            size="small"
            placeholder="Filter tasks by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
            sx={{ 
              width: 320,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
                "&:hover": { border: "1px solid #cbd5e1" },
              }
            }}
          />
        </Box>

        {/* TASK TABLE */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Priority</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Assignee</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                    <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 500 }}>No tasks found for the current search/project.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTasks.map((task) => {
                  const status = getStatusConfig(task.status);
                  const priority = getPriorityStyles(task.priority);

                  return (
                    <TableRow key={task.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={{ py: 2.5 }}>
                        <Typography fontWeight={700} sx={{ color: "#1e293b", fontSize: "0.95rem" }}>{task.title}</Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                          {task.description ? (task.description.length > 50 ? `${task.description.substring(0, 50)}...` : task.description) : "No description provided"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{ 
                            fontWeight: 800, 
                            fontSize: "0.65rem", 
                            color: status.color, 
                            bgcolor: status.bg, 
                            borderRadius: "8px",
                            height: "24px",
                            px: 1
                          }}
                        />
                      </TableCell>

                      <TableCell>
                         <Stack direction="row" spacing={1} alignItems="center">
                           <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: priority.color }} />
                           <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>{priority.label}</Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "#64748b" }}>
                          <CalendarIcon sx={{ fontSize: 16 }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: "#1e293b" }}>
                            {task.dueDate?.split("T")[0] || "—"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 30, height: 30, fontSize: "0.75rem", bgcolor: "#4f46e5", fontWeight: 700 }}>
                            {task.user?.name?.[0] || "?"}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600} color="#334155">
                            {task.user?.name || "Unassigned"}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
                          <IconButton size="small" onClick={() => openEditDialog(task)} sx={{ color: "#6366f1", "&:hover": { bgcolor: "#eef2ff" } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => setDeleteTaskId(task.id)} sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fef2f2" }, ml: 1 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </RoleGuard>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              sx={{
                "& .MuiPaginationItem-root": { fontWeight: 700, borderRadius: "10px" },
                "& .Mui-selected": { bgcolor: "#6366f1 !important", color: "#fff" }
              }}
            />
          </Box>
        )}
      </Container>

      {/* CREATE / EDIT TASK DIALOG */}
      <Dialog 
        open={openTaskDialog} 
        onClose={() => setOpenTaskDialog(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#1e293b", fontSize: "1.35rem", pb: 1 }}>
          {editTaskId ? "Update Task" : "Create New Task"}
          <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 500, mt: 0.5 }}>
              Complete the fields below to manage project tasks.
          </Typography>
        </DialogTitle>
        <Divider sx={{ mx: 2, mb: 2 }} />
        <DialogContent sx={{ py: 0 }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Task Title"
              placeholder="e.g. Design Landing Page"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Provide context for this task..."
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={taskData.status}
                label="Status"
                onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskData.priority}
                label="Priority"
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select
                label="Assign To"
                value={taskData.assigneeId}
                onChange={(e) => setTaskData({ ...taskData, assigneeId: e.target.value })}
                sx={{ borderRadius: 3 }}
              >
                {members.map((m) => (
                  <MenuItem key={m.user.id} value={m.user.id}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 22, height: 22, fontSize: "0.6rem" }}>{m.user.name[0]}</Avatar>
                      <Typography variant="body2" fontWeight={600}>
                       {m.user.name} ({m.role?.charAt(0).toUpperCase() + m.role?.slice(1).toLowerCase()})
                      </Typography>

                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 3 }}>
          <Button onClick={() => setOpenTaskDialog(false)} sx={{ fontWeight: 700, color: "#94a3b8", textTransform: "none" }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            disableElevation 
            onClick={submitTask}
            sx={{ px: 4, py: 1, borderRadius: 3, fontWeight: 700, bgcolor: "#6366f1", textTransform: "none" }}
          >
            {editTaskId ? "Update Task" : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        confirmText="Confirm Delete"
        onConfirm={deleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </Box>
  );
};

export default ProjectPreview;