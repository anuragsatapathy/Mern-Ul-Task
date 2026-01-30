import { useEffect, useState } from "react";
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
  Grid,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  Divider,
  Card,
  IconButton,
  Stack,
  Container,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarIcon,
  Flag as PriorityIcon,
  Layers as ProjectIcon,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";

const ProjectPreview = () => {
  const { projectId } = useParams();
  const workspaceRole = localStorage.getItem("workspaceRole");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const loadProject = async () => {
    try {
      const res = await axios.get(`/projects/${projectId}`);
      setProject(res.data.data);
    } catch {
      showError("Failed to load project");
    }
  };

  const loadTasks = async () => {
    try {
      const res = await axios.get(`/tasks?projectId=${projectId}`);
      setTasks(res.data.data || []);
    } catch {
      showError("Failed to load tasks");
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([loadProject(), loadTasks()]);
      setLoading(false);
    };
    loadAll();
  }, [projectId]);

  const openCreateDialog = () => {
    setEditTaskId(null);
    setTaskData({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    });
    setOpenTaskDialog(true);
  };

  const openEditDialog = (task) => {
    setEditTaskId(task.id);
    setTaskData({
      title: task.title,
      description: task.description || "",
      status: task.status?.toLowerCase().replace("_", "-"),
      priority: task.priority?.toLowerCase(),
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
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

  const getPriorityProps = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high') return { color: '#dc2626', bg: '#fee2e2' };
    if (p === 'medium') return { color: '#d97706', bg: '#fef3c7' };
    return { color: '#059669', bg: '#d1fae5' };
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'todo') return '#94a3b8';
    if (s === 'in-progress') return '#3b82f6';
    if (s === 'done') return '#10b981';
    return '#6366f1';
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: 'center', height: '100vh', bgcolor: '#f8fafc' }}>
        <CircularProgress size={40} thickness={4} sx={{ color: "#4f46e5" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* HEADER SECTION */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Avatar sx={{ bgcolor: '#4f46e5', width: 32, height: 32 }}>
                <ProjectIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, letterSpacing: 0.5 }}>
                PROJECT PREVIEW
              </Typography>
            </Stack>
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: '-0.02em' }}>
              {project?.name}
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", mt: 1, maxWidth: 500 }}>
              {project?.description || "Monitor tasks and manage project delivery phases."}
            </Typography>
          </Box>

          <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              sx={{
                bgcolor: '#1e293b',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: '10px',
                '&:hover': { bgcolor: '#0f172a' }
              }}
            >
              Add Task
            </Button>
          </RoleGuard>
        </Box>

        {/* STATS SUMMARY (Mini View) */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {['todo', 'in-progress', 'done'].map((status) => (
            <Grid item xs={12} sm={4} key={status}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(status) }} />
                <Typography variant="subtitle2" sx={{ color: '#475569', textTransform: 'capitalize' }}>
                  {status.replace('-', ' ')}: <b>{tasks.filter(t => t.status === status).length}</b>
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* TASK LISTING */}
        <Grid container spacing={3}>
          {tasks.map((task) => {
            const priority = getPriorityProps(task.priority);
            return (
              <Grid item xs={12} key={task.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderColor: '#cbd5e1' },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0, top: 0, bottom: 0,
                        width: '4px',
                        bgcolor: getStatusColor(task.status),
                        borderRadius: '16px 0 0 16px'
                    }
                  }}
                >
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ flexGrow: 1 }}>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
                          {task.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip 
                            label={task.status?.toUpperCase()} 
                            size="small"
                            sx={{ fontSize: '10px', fontWeight: 700, bgcolor: '#f1f5f9', color: getStatusColor(task.status) }} 
                          />
                          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 14 }} /> {task.dueDate?.split("T")[0] || "No Deadline"}
                          </Typography>
                        </Stack>
                      </Box>
                      
                      <Typography variant="body2" sx={{ color: '#64748b', display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                        {task.description || "—"}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                         <Stack alignItems="center">
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>PRIORITY</Typography>
                            <Box sx={{ px: 1.5, py: 0.5, borderRadius: '6px', bgcolor: priority.bg, color: priority.color, fontSize: '11px', fontWeight: 700 }}>
                                {task.priority?.toUpperCase()}
                            </Box>
                         </Stack>
                         
                         <Stack alignItems="flex-end">
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>ASSIGNEE</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>{task.user?.name || "Unassigned"}</Typography>
                         </Stack>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ ml: 4 }}>
                      <IconButton size="small" onClick={() => openEditDialog(task)} sx={{ color: '#64748b' }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => setDeleteTaskId(task.id)} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444' } }}><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* REFINED DIALOG */}
      <Dialog 
        open={openTaskDialog} 
        onClose={() => setOpenTaskDialog(false)} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b' }}>
          {editTaskId ? "Edit Task" : "New Task"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth label="Task Title"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField
              fullWidth label="Description" multiline rows={3}
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={taskData.status}
                  onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  label="Priority"
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth type="date" label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={taskData.dueDate}
              onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenTaskDialog(false)} sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={submitTask} 
            sx={{ 
                bgcolor: '#4f46e5', 
                borderRadius: '10px', 
                textTransform: 'none', 
                fontWeight: 600, 
                px: 3,
                '&:hover': { bgcolor: '#4338ca' }
            }}
          >
            {editTaskId ? "Save Changes" : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTaskId}
        title="Remove Task"
        message="This will permanently delete this task. Are you sure?"
        confirmText="Delete"
        onConfirm={deleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </Box>
  );
};

export default ProjectPreview;