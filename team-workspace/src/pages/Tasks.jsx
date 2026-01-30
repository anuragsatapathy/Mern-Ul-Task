import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import ConfirmDialog from "../components/ConfirmDialog";
import TaskCard from "../components/TaskCard";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Paper,
  Grid,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Chip
} from "@mui/material";
import { 
  Add as AddIcon, 
  TaskAlt as TaskIcon, 
  Update as UpdateIcon 
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";
import useAuth from "../auth/useAuth";

const Tasks = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/tasks`, {
        params: { projectId },
      });
      setTasks(res.data.data || []);
    } catch {
      showError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadTasks();
  }, [projectId]);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setStatus(editTask.status || "TODO");
      setPriority(editTask.priority || "MEDIUM");
      setDueDate(editTask.dueDate ? editTask.dueDate.split('T')[0] : "");
    }
  }, [editTask]);

  const saveTask = async () => {
    if (!title.trim()) {
      showError("Title required");
      return;
    }

    const payload = {
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
      projectId, 
    };

    try {
      if (editTask) {
        await axios.put(`/tasks/${editTask.id}`, payload);
        showSuccess("Task updated");
      } else {
        await axios.post(`/tasks`, payload);
        showSuccess("Task created");
      }

      setTitle("");
      setDescription("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setDueDate("");
      setEditTask(null);

      loadTasks();
    } catch (err) {
      showError("Failed to save task");
    }
  };
  const deleteTask = async () => {
    try {
      await axios.delete(`/tasks/${deleteId}`);
      showSuccess("Task deleted");
      setDeleteId(null);
      loadTasks();
    } catch {
      showError("Delete failed");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 6, px: { md: 8 } }}>
       
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b", mb: 1, fontSize: '2.5rem' }}>
            Tasks
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>
            Manage your project requirements and daily objectives
          </Typography>
        </Box>
        <Paper 
          elevation={0}
          sx={{ 
            p: 2.5, mb: 8, borderRadius: '16px', 
            border: "1px solid #e2e8f0", 
            bgcolor: "#ffffff",
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2.5}>
              <TextField
                fullWidth placeholder="Task Title" size="medium"
                value={title} onChange={(e) => setTitle(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px', bgcolor: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth type="date" size="medium"
                value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px', bgcolor: '#fff' } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth placeholder="Description" size="medium"
                value={description} onChange={(e) => setDescription(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px', bgcolor: '#fff' } }}
              />
            </Grid>
            <Grid item xs={6} md={1.5}>
              <Select 
                fullWidth value={status} size="medium"
                onChange={(e) => setStatus(e.target.value)} 
                sx={{ borderRadius: '12px', bgcolor: '#fff' }}
              >
                <MenuItem value="TODO">Todo</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="DONE">Done</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} md={1.5}>
              <Select 
                fullWidth value={priority} size="medium"
                onChange={(e) => setPriority(e.target.value)} 
                sx={{ borderRadius: '12px', bgcolor: '#fff' }}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} md={1.5}>
              <Button 
                fullWidth variant="contained" 
                startIcon={editTask ? <UpdateIcon /> : <AddIcon />}
                onClick={saveTask}
                sx={{ 
                  borderRadius: '12px', py: 1.5, textTransform: "none", fontWeight: 700, 
                  bgcolor: "#6366f1", boxShadow: 'none',
                  "&:hover": { bgcolor: "#4f46e5", boxShadow: 'none' }
                }}
              >
                {editTask ? "Update" : "Create"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
           <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.9rem', mr: 2 }}>Your Tasks</Typography>
           <Divider sx={{ flexGrow: 1, borderColor: '#e2e8f0' }} />
        </Box>

        {/* LIST SECTION */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: "#6366f1" }} />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper 
            sx={{ 
              textAlign: "center", py: 12, borderRadius: 6, 
              border: '2px dashed #e2e8f0', bgcolor: 'transparent' 
            }} 
            elevation={0}
          >
            <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 600 }}>
              No tasks found for this project.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <TaskCard
                  task={task}
                  onEdit={() => setEditTask(task)}
                  onDelete={() => setDeleteId(task.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Task?"
        message="This action cannot be undone."
        onConfirm={deleteTask}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default Tasks;